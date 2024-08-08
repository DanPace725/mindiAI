import { LLM } from "@/types"

const ANTHROPIC_PLATORM_LINK =
  "https://docs.anthropic.com/claude/reference/getting-started-with-the-api"

// Anthropic Models (UPDATED 03/04/24) -----------------------------

// Claude 2 (UPDATED 12/21/23)
const CLAUDE_2: LLM = {
  modelId: "claude-2.1",
  modelName: "Claude 2",
  provider: "anthropic",
  hostedId: "claude-2.1",
  platformLink: ANTHROPIC_PLATORM_LINK,
  imageInput: false
}

// Claude Instant (UPDATED 12/21/23)
const CLAUDE_INSTANT: LLM = {
  modelId: "claude-instant-1.2",
  modelName: "Claude Instant",
  provider: "anthropic",
  hostedId: "claude-instant-1.2",
  platformLink: ANTHROPIC_PLATORM_LINK,
  imageInput: false
}

// Claude 3 Sonnet (UPDATED 03/04/24)
const CLAUDE_3_SONNET: LLM = {
  modelId: "claude-3-sonnet-20240229",
  modelName: "Claude 3 Sonnet",
  provider: "anthropic",
  hostedId: "claude-3-sonnet-20240229",
  platformLink: ANTHROPIC_PLATORM_LINK,
  imageInput: false
}

// Claude 3 Opus (UPDATED 03/04/24)
const CLAUDE_3_OPUS: LLM = {
  modelId: "claude-3-opus-20240229",
  modelName: "Claude 3 Opus",
  provider: "anthropic",
  hostedId: "claude-3-opus-20240229",
  platformLink: ANTHROPIC_PLATORM_LINK,
  imageInput: false
}

const CLAUDE_3_5_SONNET: LLM = {
  modelId: "claude-3-5-sonnet-20240620",
  modelName: "Claude 3.5 Sonnet",
  provider: "anthropic",
  hostedId: "claude-3-5-sonnet-20240620",
  platformLink: ANTHROPIC_PLATORM_LINK,
  imageInput: true,
  pricing: {
    currency: "USD",
    unit: "1M tokens",
    inputCost: 3,
    outputCost: 15
  }
}

export const ANTHROPIC_LLM_LIST: LLM[] = [
  CLAUDE_2,
  CLAUDE_INSTANT,
  CLAUDE_3_SONNET,
  CLAUDE_3_OPUS,
  CLAUDE_3_5_SONNET
]
