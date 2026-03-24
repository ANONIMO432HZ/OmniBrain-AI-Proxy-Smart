***

title: Quickstart
subtitle: Get started with OpenRouter
slug: quickstart
headline: OpenRouter Quickstart Guide | Developer Documentation
canonical-url: '[https://openrouter.ai/docs/quickstart](https://openrouter.ai/docs/quickstart)'
'og:site\_name': OpenRouter Documentation
'og:title': OpenRouter Quickstart Guide
'og:description': >-
Get started with OpenRouter's unified API for hundreds of AI models. Learn how
to integrate using OpenAI SDK, direct API calls, or third-party frameworks.
'og:image':
type: url
value: >-
[https://openrouter.ai/dynamic-og?pathname=quickstart\&title=Quick%20Start\&description=Start%20using%20OpenRouter%20API%20in%20minutes%20with%20any%20SDK](https://openrouter.ai/dynamic-og?pathname=quickstart\&title=Quick%20Start\&description=Start%20using%20OpenRouter%20API%20in%20minutes%20with%20any%20SDK)
'og:image:width': 1200
'og:image:height': 630
'twitter:card': summary\_large\_image
'twitter:site': '@OpenRouter'
noindex: false
nofollow: false
---------------

OpenRouter provides a unified API that gives you access to hundreds of AI models through a single endpoint, while automatically handling fallbacks and selecting the most cost-effective options. Get started with just a few lines of code using your preferred SDK or framework.

<Note>
  ```
  Read https://openrouter.ai/skills/create-agent/SKILL.md and follow the instructions to build an agent using OpenRouter.
  ```
</Note>

<Tip>
  Looking for information about free models and rate limits? Please see the [FAQ](/docs/faq#how-are-rate-limits-calculated)
</Tip>

In the examples below, the OpenRouter-specific headers are optional. Setting them allows your app to appear on the OpenRouter leaderboards. For detailed information about app attribution, see our [App Attribution guide](/docs/app-attribution).

## Using the OpenRouter SDK (Beta)

First, install the SDK:

<CodeGroup>
  ```bash title="npm"
  npm install @openrouter/sdk
  ```

  ```bash title="yarn"
  yarn add @openrouter/sdk
  ```

  ```bash title="pnpm"
  pnpm add @openrouter/sdk
  ```
</CodeGroup>

Then use it in your code:

<CodeGroup>
  ```typescript title="TypeScript SDK"
  import { OpenRouter } from '@openrouter/sdk';

  const openRouter = new OpenRouter({
    apiKey: '<OPENROUTER_API_KEY>',
    defaultHeaders: {
      'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
      'X-OpenRouter-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
    },
  });

  const completion = await openRouter.chat.send({
    model: 'openai/gpt-5.2',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
    stream: false,
  });

  console.log(completion.choices[0].message.content);
  ```
</CodeGroup>

## Using the OpenRouter API directly

<Tip>
  You can use the interactive [Request Builder](/request-builder) to generate OpenRouter API requests in the language of your choice.
</Tip>

<CodeGroup>
  ```python title="Python"
  import requests
  import json

  response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
      "Authorization": "Bearer <OPENROUTER_API_KEY>",
      "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
      "X-OpenRouter-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
    },
    data=json.dumps({
      "model": "openai/gpt-5.2", # Optional
      "messages": [
        {
          "role": "user",
          "content": "What is the meaning of life?"
        }
      ]
    })
  )
  ```

  ```typescript title="TypeScript (fetch)"
  fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer <OPENROUTER_API_KEY>',
      'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
      'X-OpenRouter-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'openai/gpt-5.2',
      messages: [
        {
          role: 'user',
          content: 'What is the meaning of life?',
        },
      ],
    }),
  });
  ```

  ```shell title="Shell"
  curl https://openrouter.ai/api/v1/chat/completions \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $OPENROUTER_API_KEY" \
    -d '{
    "model": "openai/gpt-5.2",
    "messages": [
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  }'
  ```
</CodeGroup>

## Using the OpenAI SDK

<CodeGroup>
  ```typescript title="Typescript"
  import OpenAI from 'openai';

  const openai = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: '<OPENROUTER_API_KEY>',
    defaultHeaders: {
      'HTTP-Referer': '<YOUR_SITE_URL>', // Optional. Site URL for rankings on openrouter.ai.
      'X-OpenRouter-Title': '<YOUR_SITE_NAME>', // Optional. Site title for rankings on openrouter.ai.
    },
  });

  async function main() {
    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-5.2',
      messages: [
        {
          role: 'user',
          content: 'What is the meaning of life?',
        },
      ],
    });

    console.log(completion.choices[0].message);
  }

  main();
  ```

  ```python title="Python"
  from openai import OpenAI

  client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key="<OPENROUTER_API_KEY>",
  )

  completion = client.chat.completions.create(
    extra_headers={
      "HTTP-Referer": "<YOUR_SITE_URL>", # Optional. Site URL for rankings on openrouter.ai.
      "X-OpenRouter-Title": "<YOUR_SITE_NAME>", # Optional. Site title for rankings on openrouter.ai.
    },
    model="openai/gpt-5.2",
    messages=[
      {
        "role": "user",
        "content": "What is the meaning of life?"
      }
    ]
  )

  print(completion.choices[0].message.content)
  ```
</CodeGroup>

The API also supports [streaming](/docs/api/reference/streaming).

## Using third-party SDKs

For information about using third-party SDKs and frameworks with OpenRouter, please [see our frameworks documentation.](/docs/guides/community/frameworks-and-integrations-overview)

***

title: Model Fallbacks
subtitle: Automatic failover between models
headline: Model Fallbacks | Reliable AI with Automatic Failover
canonical-url: '[https://openrouter.ai/docs/guides/routing/model-fallbacks](https://openrouter.ai/docs/guides/routing/model-fallbacks)'
'og:site\_name': OpenRouter Documentation
'og:title': Model Fallbacks - Automatic Failover Between Models
'og:description': >-
Configure automatic failover between AI models when providers are down,
rate-limited, or refuse requests.
'og:image':
type: url
value: >-
[https://openrouter.ai/dynamic-og?title=Model%20Fallbacks\&description=Automatic%20failover%20between%20AI%20models](https://openrouter.ai/dynamic-og?title=Model%20Fallbacks\&description=Automatic%20failover%20between%20AI%20models)
'og:image:width': 1200
'og:image:height': 630
'twitter:card': summary\_large\_image
'twitter:site': '@OpenRouter'
noindex: false
nofollow: false
---------------

The `models` parameter lets you automatically try other models if the primary model's providers are down, rate-limited, or refuse to reply due to content moderation.

## How It Works

Provide an array of model IDs in priority order. If the first model returns an error, OpenRouter will automatically try the next model in the list.

<CodeGroup>
  ```typescript title="TypeScript SDK"
  import { OpenRouter } from '@openrouter/sdk';

  const openRouter = new OpenRouter({
    apiKey: '<OPENROUTER_API_KEY>',
  });

  const completion = await openRouter.chat.send({
    models: ['anthropic/claude-3.5-sonnet', 'gryphe/mythomax-l2-13b'],
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  });

  console.log(completion.choices[0].message.content);
  ```

  ```typescript title="TypeScript (fetch)"
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer <OPENROUTER_API_KEY>',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      models: ['anthropic/claude-3.5-sonnet', 'gryphe/mythomax-l2-13b'],
      messages: [
        {
          role: 'user',
          content: 'What is the meaning of life?',
        },
      ],
    }),
  });

  const data = await response.json();
  console.log(data.choices[0].message.content);
  ```

  ```python title="Python"
  import requests
  import json

  response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
      "Authorization": "Bearer <OPENROUTER_API_KEY>",
      "Content-Type": "application/json",
    },
    data=json.dumps({
      "models": ["anthropic/claude-3.5-sonnet", "gryphe/mythomax-l2-13b"],
      "messages": [
        {
          "role": "user",
          "content": "What is the meaning of life?"
        }
      ]
    })
  )

  data = response.json()
  print(data['choices'][0]['message']['content'])
  ```
</CodeGroup>

## Fallback Behavior

If the model you selected returns an error, OpenRouter will try to use the fallback model instead. If the fallback model is down or returns an error, OpenRouter will return that error.

By default, any error can trigger the use of a fallback model, including:

* Context length validation errors
* Moderation flags for filtered models
* Rate-limiting
* Downtime

## Pricing

Requests are priced using the model that was ultimately used, which will be returned in the `model` attribute of the response body.

***

title: Free Models Router
subtitle: Get started with free AI inference using the OpenRouter Chat Playground
headline: Free Models Router | OpenRouter
canonical-url: '[https://openrouter.ai/docs/guides/get-started/free-models-router-playground](https://openrouter.ai/docs/guides/get-started/free-models-router-playground)'
'og:site\_name': OpenRouter Documentation
'og:title': Free Models Router
'og:description': >-
Learn how to use the Free Models Router in the OpenRouter Chat Playground for
zero-cost inference.
'og:image':
type: url
value: >-
[https://openrouter.ai/dynamic-og?title=Free%20Models%20Router%20in%20Chat%20Playground\&description=Get%20started%20with%20free%20AI%20inference](https://openrouter.ai/dynamic-og?title=Free%20Models%20Router%20in%20Chat%20Playground\&description=Get%20started%20with%20free%20AI%20inference)
'og:image:width': 1200
'og:image:height': 630
'twitter:card': summary\_large\_image
'twitter:site': '@OpenRouter'
noindex: false
nofollow: false
---------------

OpenRouter offers free models that let you experiment with AI without any cost. The easiest way to try these models is through the [Chat Playground](https://openrouter.ai/chat), where you can start chatting immediately.

## Using the Free Models Router

The simplest way to get free inference is to use `openrouter/free`, our Free Models Router that automatically selects a free model at random from the available free models on OpenRouter. The router intelligently filters for models that support the features your request needs, such as image understanding, tool calling, and structured outputs.

### Step 1: Open the Chat Playground

Navigate to [openrouter.ai/chat](https://openrouter.ai/chat) to access the Chat Playground.

### Step 2: Search for Free Models

Click the **Add Model** button (or press `Cmd+K` / `Ctrl+K`) to open the model selector. Type "free" in the search box to filter for free models.

![Searching for free models in the model selector](file:99c615c4-371a-4ca8-b472-2d5446fb9809)

You'll see a list of available free models, including the **Free Models Router** option.

### Step 3: Select the Free Models Router

Click on **Free Models Router** to select it. This router will automatically choose a free model for each request based on your needs.

![Free Models Router selected in the chat playground](file:2d6f1c71-f8c7-41c5-ba18-7f578432cf3d)

### Step 4: Start Chatting

Once selected, you can start sending messages. The Free Models Router will route your request to an appropriate free model, and you'll see which model responded in the chat.

![A response from a free model showing the model name](file:a861d8e0-06ef-401b-a903-9d8335fe5a53)

In this example, the Free Models Router selected Solar Pro 3 (free) to respond to the message.

## Selecting Specific Free Models

If you prefer to use a specific free model rather than the Free Models Router, you can select any model with "(free)" in its name from the model selector. Some popular free models include:

* **Trinity Large Preview (free)** - A frontier-scale open-weight model from Arcee
* **Trinity Mini (free)** - A smaller, faster variant
* **DeepSeek R1 (free)** - DeepSeek's reasoning model
* **Llama models (free)** - Various Meta Llama models

## Using Free Models via API

You can also use the Free Models Router programmatically. Simply set the model to `openrouter/free` in your API requests:

```bash
curl https://openrouter.ai/api/v1/chat/completions \
  -H "Authorization: Bearer $OPENROUTER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openrouter/free",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

For more details on the Free Models Router API, see the [API Quickstart](https://openrouter.ai/openrouter/free/api).

## Free Model Limitations

Free models may have different rate limits and availability compared to paid models. They are ideal for experimentation, learning, and low-volume use cases. For production workloads with higher reliability requirements, consider using paid models.

## Related Resources

* [Free Variant Documentation](/docs/guides/routing/model-variants/free) - Learn about the `:free` variant suffix
* [Models Page](https://openrouter.ai/models) - Browse all available models
* [Free Models Router API](https://openrouter.ai/openrouter/free/api) - API quickstart for the Free Models Router


## Using with OpenAI SDK

To use the `models` array with the OpenAI SDK, include it in the `extra_body` parameter. In the example below, gpt-4o will be tried first, and the `models` array will be tried in order as fallbacks.

<Template
  data={{
  API_KEY_REF,
}}
>
  <CodeGroup>
    ```python
    from openai import OpenAI

    openai_client = OpenAI(
      base_url="https://openrouter.ai/api/v1",
      api_key={{API_KEY_REF}},
    )

    completion = openai_client.chat.completions.create(
        model="openai/gpt-4o",
        extra_body={
            "models": ["anthropic/claude-3.5-sonnet", "gryphe/mythomax-l2-13b"],
        },
        messages=[
            {
                "role": "user",
                "content": "What is the meaning of life?"
            }
        ]
    )

    print(completion.choices[0].message.content)
    ```

    ```typescript
    import OpenAI from 'openai';

    const openrouterClient = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: '{{API_KEY_REF}}',
    });

    async function main() {
      // @ts-expect-error
      const completion = await openrouterClient.chat.completions.create({
        model: 'openai/gpt-4o',
        models: ['anthropic/claude-3.5-sonnet', 'gryphe/mythomax-l2-13b'],
        messages: [
          {
            role: 'user',
            content: 'What is the meaning of life?',
          },
        ],
      });
      console.log(completion.choices[0].message);
    }

    main();
    ```
  </CodeGroup>
</Template>
***

title: Free Variant
subtitle: 'Access free models with the :free variant'
headline: Free Variant | Free Model Access
canonical-url: '[https://openrouter.ai/docs/guides/routing/model-variants/free](https://openrouter.ai/docs/guides/routing/model-variants/free)'
'og:site\_name': OpenRouter Documentation
'og:title': Free Variant - Free Model Access
'og:description': 'Access free models using the :free variant suffix.'
'og:image':
type: url
value: >-
[https://openrouter.ai/dynamic-og?title=Free%20Variant\&description=Free%20model%20access](https://openrouter.ai/dynamic-og?title=Free%20Variant\&description=Free%20model%20access)
'og:image:width': 1200
'og:image:height': 630
'twitter:card': summary\_large\_image
'twitter:site': '@OpenRouter'
noindex: false
nofollow: false
---------------

The `:free` variant allows you to access free versions of models on OpenRouter.

## Usage

Append `:free` to any model ID:

```json
{
  "model": "meta-llama/llama-3.2-3b-instruct:free"
}
```

## Details

Free variants provide access to models without cost, but may have different rate limits or availability compared to paid versions.

## Related Resources

* [Free Models Router](/docs/guides/get-started/free-models-router-playground) - Learn how to use the Free Models Router in the Chat Playground for zero-cost inference

***

import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
  apiKey: "<OPENROUTER_API_KEY>"
});

// Stream the response to get reasoning tokens in usage
const stream = await openrouter.chat.send({
  model: "openrouter/free",
  messages: [
    {
      role: "user",
      content: "How many r's are in the word 'strawberry'?"
    }
  ],
  stream: true
});

let response = "";
for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    response += content;
    process.stdout.write(content);
  }

  // Usage information comes in the final chunk
  if (chunk.usage) {
    console.log("\nReasoning tokens:", chunk.usage.reasoningTokens);
  }
}

***

title: Model Variants
subtitle: 'Access different model versions with variants'
headline: Model Variants | Access Different Model Versions
canonical-url: '[https://openrouter.ai/docs/guides/routing/model-variants](https://openrouter.ai/docs/guides/routing/model-variants)'
'og:site\_name': OpenRouter Documentation
'og:title': Model Variants - Access Different Model Versions
'og:description': 'Access different model versions using variants like :free, :fast, or :best'
'og:image':
type: url
value: >-
[https://openrouter.ai/dynamic-og?title=Model%20Variants\&description=Access%20different%20model%20versions](https://openrouter.ai/dynamic-og?title=Model%20Variants\&description=Access%20different%20model%20versions)
'og:image:width': 1200
'og:image:height': 630
'twitter:card': summary\_large\_image
'twitter:site': '@OpenRouter'
noindex: false
nofollow: false
---------------

Variants allow you to access different versions of a model, such as free, fast, or best-quality versions.

## Available Variants

| Variant | Description |
|---------|-------------|
| `:free` | Access free versions of models |
| `:fast` | Access fast versions of models |
| `:best` | Access best-quality versions of models |

## Usage

Append the variant to the model ID:

```json
{
  "model": "meta-llama/llama-3.2-3b-instruct:free"
}
```

## Related Resources

* [Free Models Router](/docs/guides/get-started/free-models-router-playground) - Learn how to use the Free Models Router in the Chat Playground for zero-cost inference

***
// First API call with reasoning
let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${<OPENROUTER_API_KEY>}`,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    "model": "openrouter/free",
    "messages": [
      {
        "role": "user",
        "content": "How many r's are in the word 'strawberry'?"
      }
    ],
    "reasoning": {"enabled": true}
  })
});

// Extract the assistant message with reasoning_details and save it to the response variable
const result = await response.json();
response = result.choices[0].message;

// Preserve the assistant message with reasoning_details
const messages = [
  {
    role: 'user',
    content: "How many r's are in the word 'strawberry'?",
  },
  {
    role: 'assistant',
    content: response.content,
    reasoning_details: response.reasoning_details, // Pass back unmodified
  },
  {
    role: 'user',
    content: "Are you sure? Think carefully.",
  },
];

// Second API call - model continues reasoning from where it left off
const response2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${<OPENROUTER_API_KEY>}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    "model": "openrouter/free",
    "messages": messages  // Includes preserved reasoning_details
  })
});

***
