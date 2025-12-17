---
pubDatetime: 2025-12-14T10:15:00Z
title: Building Agentic AI Systems - Part 7 - Putting It All Together
slug: building-agentic-agent-part-7
featured: false
draft: false
tags:
  - tech
  - ai
  - agents
description: Part 7 - Complete implementation examples including basic agents, structured output extractors, and custom middleware. Summarizes best practices and key design decisions.
---

*Complete implementation examples and best practices*

In [Part 6](/posts/building-agentic-agent-part-6), we covered building tools. Now let's bring everything together with complete implementation examples.

## Basic Agent Setup

Here's the complete pattern for creating and executing an agent:

```rust
use std::sync::Arc;
use reflexify::agents::{
    executor::AgentExecutor,
    profile::{AgentProfile, StepperType, GenerationConfig, ModelRef},
    tools::ToolRegistry,
};

// 1. Create profile
let profile = AgentProfile::builder("my-agent")
    .name("My Agent")
    .model(ModelRef::openai("gpt-4o"))
    .stepper_type(StepperType::FunctionCalling)
    .system_prompt("You are a helpful assistant...")
    .tools(tool_definitions)
    .max_iterations(10)
    .generation(GenerationConfig::new().temperature(0.0))
    .build();

// 2. Create executor
let executor = AgentExecutor::new(
    Arc::new(profile),
    Arc::new(tool_registry),
    llm,
);

// 3. Execute
let result = executor.execute(&mut context, None).await?;
```

## Structured Output Agent

For agents that return structured JSON (extraction, classification, etc.):

```rust
use schemars::JsonSchema;

/// Output type for structured extraction
#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct ExtractedFact {
    pub content: String,
    pub kind: MemoryKind,
}

#[derive(Debug, Clone, Serialize, Deserialize, JsonSchema)]
pub struct ExtractedFactsResponse {
    pub facts: Vec<ExtractedFact>,
}

/// ExtractionAgent - Extracts facts from conversation messages
pub struct ExtractionAgent {
    executor: AgentExecutor,
}

impl ExtractionAgent {
    pub fn new(llm: Arc<dyn LLM>) -> Self {
        let profile = Self::build_profile(Self::model_ref_from_llm(&llm));
        let executor = AgentExecutor::new(
            Arc::new(profile),
            Arc::new(ToolRegistry::new()),  // No tools needed
            llm,
        );
        Self { executor }
    }

    fn build_profile(model: ModelRef) -> AgentProfile {
        // Generate JSON schema for structured output
        let schema = schemars::schema_for!(ExtractedFactsResponse);
        let schema_json = serde_json::to_value(schema)
            .expect("Failed to serialize schema");
        let response_format = StructuredOutputFormat::new(
            "ExtractedFactsResponse",
            schema_json
        );

        AgentProfile::builder("extraction")
            .name("Extraction Agent")
            .description("Extracts durable facts from conversation messages")
            .model(model)
            .stepper_type(StepperType::FunctionCalling)
            .system_prompt(EXTRACTION_PROMPT)
            .max_iterations(1)  // Single-shot
            .generation(GenerationConfig::new().temperature(0.0))
            .response_format(response_format)
            .build()
    }

    pub async fn execute(
        &self,
        context: &mut dyn AgentContext
    ) -> Result<AgentExecutionResult> {
        self.executor.execute(context, None).await
    }
}
```

Usage:

```rust
let extraction_agent = ExtractionAgent::new(llm);

let mut context = StatelessAgentContext::new()
    .with_query(format!("Extract facts from:\n{}", conversation));

let result = extraction_agent.execute(&mut context).await?;

// Parse structured output
let response: ExtractedFactsResponse = serde_json::from_str(&result.answer)?;
for fact in response.facts {
    println!("{}: {}", fact.kind, fact.content);
}
```

## Using Different Contexts

```rust
// Stateless (simple Q&A, no persistence)
let mut context = StatelessAgentContext::new()
    .with_query("What is X?");

// Chat-based (with history, persistence, compaction)
let context = ChatAgentContext::new(
    &chat,
    system_prompt,
    &tools,
    &llm,
    repository,
    compaction_strategy,
).await?;
```

## Best Practices

### 1. Keep Profiles Declarative

```rust
// Good: Configuration-driven
let profile = AgentProfile::builder("agent")
    .max_iterations(10)
    .generation(GenerationConfig::new().temperature(0.0))
    .build();

// Bad: Hard-coded in stepper logic
```

### 2. Use Appropriate Stepper

| Use Case | Recommended Stepper |
|----------|-------------------|
| Tool calling with OpenAI/Anthropic/Gemini | FunctionCalling |
| Explicit reasoning traces | React |
| Structured extraction (no tools) | FunctionCalling + response_format |
| Models without function calling | React |

### 3. Design Clean Tool Interfaces

```rust
// Good: Clear, focused tools with typed input
#[derive(Deserialize, JsonSchema)]
struct SearchInput {
    /// Search query string
    query: String,
    /// Maximum number of results
    #[serde(default = "default_limit")]
    limit: u32,
}

fn name(&self) -> &str { "search_knowledge" }
fn description(&self) -> &str {
    "Search the knowledge base for relevant information"
}

// Bad: Vague, overly broad tools
fn name(&self) -> &str { "do_stuff" }
```

### 4. Handle Failures Gracefully

```rust
// Tools should return errors via ToolResult, not panic
async fn execute(&self, input: ToolInput) -> Result<ToolResult, ToolError> {
    let params: MyInput = input.parse()?;

    match self.internal_call(&params).await {
        Ok(result) => Ok(ToolResult::success(self.name(), result)
            .with_data(serde_json::to_value(result)?)),
        Err(e) => Ok(ToolResult::failure(self.name(), format!("Failed: {}", e))),
    }
}
```

### 5. Set Reasonable Limits

```rust
AgentProfile::builder("agent")
    .max_iterations(10)      // Prevent infinite loops
    .generation(
        GenerationConfig::new()
            .max_tokens(2000)    // Limit response size
            .temperature(0.0)    // Deterministic for tools
    )
```

## Architecture Summary

The **Profile + Stepper + Executor** architecture provides:

1. **Flexibility**: Swap steppers without changing execution logic
2. **Extensibility**: Add middleware for cross-cutting concerns
3. **Clarity**: Clear separation between configuration and execution
4. **Reusability**: Same executor for all agent types
5. **Testability**: Mock any component independently

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Profile holds tools | Tools are configuration, not runtime state |
| Two context types | Separate user-facing from internal reasoning |
| Centralized params | `profile.generation_params()` prevents duplication |
| Middleware hooks | Extensible without modifying core logic |
| Step-based execution | Stepper returns outcomes, executor handles actions |
| Typed tool input | `input.parse::<T>()` ensures type safety |

### Component Reference

| Component | Source | Responsibility |
|-----------|--------|----------------|
| `AgentProfile` | `src/agents/profile/mod.rs` | Static configuration |
| `Stepper` | `src/agents/stepper/mod.rs` | Single-step logic |
| `AgentExecutor` | `src/agents/executor.rs` | Execution loop |
| `AgentContext` | `src/agents/context/mod.rs` | User-facing messages |
| `ExecutionContext` | `src/agents/execution_context.rs` | Internal reasoning |
| `Middleware` | `src/agents/middleware/mod.rs` | Execution hooks |
| `Tool` | `src/agents/tools/tool.rs` | Tool interface |
| `ToolRegistry` | `src/agents/tools/registry.rs` | Tool management |
| `LLM` | `src/llm/mod.rs` | LLM abstraction |

## Conclusion

This architecture enables building everything from simple extractors to complex multi-tool agents with the same underlying infrastructure. The key principles are:

- **Separate what from how**: Profiles define behavior, steppers implement reasoning
- **Make execution observable**: Middleware provides hooks without polluting core logic
- **Keep contexts clean**: Users see conversations, developers see reasoning traces
- **Type everything**: From tool inputs to step outcomes, types catch errors early

Whether you're building a simple Q&A bot or a complex autonomous agent, this pattern provides a solid foundation that scales with your needs.

## Series Index

1. [Part 1 - Introduction to Agentic Agents](/posts/building-agentic-agent-part-1)
2. [Part 2 - Core Architecture: Profile + Stepper + Executor](/posts/building-agentic-agent-part-2)
3. [Part 3 - Context Management: AgentContext vs ExecutionContext](/posts/building-agentic-agent-part-3)
4. [Part 4 - The Stepper Pattern: ReAct vs Function Calling](/posts/building-agentic-agent-part-4)
5. [Part 5 - Middleware Pipeline: Cross-Cutting Concerns](/posts/building-agentic-agent-part-5)
6. [Part 6 - Building Tools: Type-Safe Agent Capabilities](/posts/building-agentic-agent-part-6)
7. **Part 7 - Putting It All Together** (You are here)

*This series is based on the Ragify agentic architecture, designed for production multi-tenant SaaS applications.*
