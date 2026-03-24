https://docs.z.ai/guides/overview/pricing
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.z.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Pricing

> This page provides pricing information for Z.AI’s models and tools. All prices are in USD.

## Models

### Text Models

Prices per 1M tokens.

| Model               | Input  | Cached Input | Cached Input Storage | Output |
| :------------------ | :----- | :----------- | :------------------- | :----- |
| GLM-5               | \$1    | \$0.2        | Limited-time Free    | \$3.2  |
| GLM-5-Turbo         | \$1.2  | \$0.24       | Limited-time Free    | \$4.0  |
| GLM-5-Code          | \$1.2  | \$0.3        | Limited-time Free    | \$5    |
| GLM-4.7             | \$0.6  | \$0.11       | Limited-time Free    | \$2.2  |
| GLM-4.7-FlashX      | \$0.07 | \$0.01       | Limited-time Free    | \$0.4  |
| GLM-4.6             | \$0.6  | \$0.11       | Limited-time Free    | \$2.2  |
| GLM-4.5             | \$0.6  | \$0.11       | Limited-time Free    | \$2.2  |
| GLM-4.5-X           | \$2.2  | \$0.45       | Limited-time Free    | \$8.9  |
| GLM-4.5-Air         | \$0.2  | \$0.03       | Limited-time Free    | \$1.1  |
| GLM-4.5-AirX        | \$1.1  | \$0.22       | Limited-time Free    | \$4.5  |
| GLM-4-32B-0414-128K | \$0.1  | -            | -                    | \$0.1  |
| GLM-4.7-Flash       | Free   | Free         | Free                 | Free   |
| GLM-4.5-Flash       | Free   | Free         | Free                 | Free   |

### Vision Models

Prices per 1M tokens.

| Model           | Input  | Cached Input | Cached Input Storage | Output |
| :-------------- | :----- | :----------- | :------------------- | :----- |
| GLM-4.6V        | \$0.3  | \$0.05       | Limited-time Free    | \$0.9  |
| GLM-OCR         | \$0.03 | \\           | \\                   | \$0.03 |
| GLM-4.6V-FlashX | \$0.04 | \$0.004      | Limited-time Free    | \$0.4  |
| GLM-4.5V        | \$0.6  | \$0.11       | Limited-time Free    | \$1.8  |
| GLM-4.6V-Flash  | Free   | Free         | Free                 | Free   |

### Built-in Tools

| Tool       | Cost         |
| :--------- | :----------- |
| Web Search | \$0.01 / use |

### Image Generation Models

Prices per image.

| Model     | Price   |
| :-------- | :------ |
| GLM-Image | \$0.015 |
| CogView-4 | \$0.01  |

### Video Generation Models

Prices per video.

| Model            | Price |
| :--------------- | :---- |
| CogVideoX-3      | \$0.2 |
| ViduQ1-Text      | \$0.4 |
| ViduQ1-Image     | \$0.4 |
| ViduQ1-Start-End | \$0.4 |
| Vidu2-Image      | \$0.2 |
| Vidu2-Start-End  | \$0.2 |
| Vidu2-Reference  | \$0.4 |

### Audio Models

| Model        | Price                                                       |
| :----------- | :---------------------------------------------------------- |
| GLM-ASR-2512 | \$0.03 / MTok (equivalent to approximately \$0.0024/minute) |

### Agents

| Agent                                   | Price         |
| :-------------------------------------- | :------------ |
| GLM Slide/Poster Agent(beta)            | \$0.7 / MTok  |
| General-Purpose Translation             | \$3 / MTok    |
| Popular Special Effects Video Templates | \$0.2 / video |


Built with [Mintlify](https://mintlify.com).

> ## Documentation Index
> Fetch the complete documentation index at: https://docs.z.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# HTTP API Calls

Z.AI provides standard HTTP API interfaces that support multiple programming languages and development environments, allowing you to easily integrate Z.AI's powerful capabilities.

### Core Advantages

<CardGroup cols={2}>
  <Card title="Cross-platform Compatible" icon="globe">
    Supports all programming languages and platforms that support HTTP protocol
  </Card>

  <Card title="Standard Protocol" icon="shield-check">
    Based on RESTful design, follows HTTP standards, easy to understand and use
  </Card>

  <Card title="Flexible Integration" icon="puzzle-piece">
    Can be integrated into any existing applications and systems
  </Card>

  <Card title="Real-time Calls" icon="bolt">
    Supports synchronous and asynchronous calls to meet different scenario requirements
  </Card>
</CardGroup>

## Get API Key

1. Access [Z.AI Open Platform](https://z.ai/model-api), Register or Login.
2. Create an API Key in the [API Keys](https://z.ai/manage-apikey/apikey-list) management page.
3. Copy your API Key for use.

## API Basic Information

### General API Endpoint

```
https://api.z.ai/api/paas/v4/
```

<Warning>
  Note: When using the [GLM Coding Plan](/devpack/overview), you need to configure the dedicated \
  Coding endpoint - [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4) \
  instead of the general endpoint - [https://api.z.ai/api/paas/v4](https://api.z.ai/api/paas/v4) \
  Note: The Coding API endpoint is only for Coding scenarios and is not applicable to general API scenarios. Please use them accordingly.
</Warning>

### Request Header Requirements

```http  theme={null}
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

### Supported Authentication Methods

<Tabs>
  <Tab title="API Key Authentication">
    The simplest authentication method, directly using your API Key:

    ```bash  theme={null}
    curl --location 'https://api.z.ai/api/paas/v4/chat/completions' \
    --header 'Authorization: Bearer YOUR_API_KEY' \
    --header 'Accept-Language: en-US,en' \
    --header 'Content-Type: application/json' \
    --data '{
        "model": "glm-5",
        "messages": [
            {
                "role": "user",
                "content": "Hello"
            }
        ]
    }'
    ```
  </Tab>

  <Tab title="JWT Token Authentication">
    Use JWT Token for authentication, suitable for scenarios requiring higher security:
    Install PyJWT

    ```shell  theme={null}
    pip install PyJWT
    ```

    ```python  theme={null}
    import time
    import jwt

    def generate_token(apikey: str, exp_seconds: int):
        try:
            id, secret = apikey.split(".")
        except Exception as e:
            raise Exception("invalid apikey", e)

        payload = {
            "api_key": id,
            "exp": int(round(time.time() * 1000)) + exp_seconds * 1000,
            "timestamp": int(round(time.time() * 1000)),
        }

        return jwt.encode(
            payload,
            secret,
            algorithm="HS256",
            headers={"alg": "HS256", "sign_type": "SIGN"},
        )

    # Use the generated token
    token = generate_token("your-api-key", 3600)  # 1 hour validity
    ```
  </Tab>
</Tabs>

## Basic Call Examples

### Simple Conversation

```bash  theme={null}
curl --location 'https://api.z.ai/api/paas/v4/chat/completions' \
--header 'Authorization: Bearer YOUR_API_KEY' \
--header 'Accept-Language: en-US,en' \
--header 'Content-Type: application/json' \
--data '{
    "model": "glm-5",
    "messages": [
        {
            "role": "user",
            "content": "Please introduce the development history of artificial intelligence"
        }
    ],
    "temperature": 1.0,
    "max_tokens": 1024
}'
```

### Streaming Response

```bash  theme={null}
curl --location 'https://api.z.ai/api/paas/v4/chat/completions' \
--header 'Authorization: Bearer YOUR_API_KEY' \
--header 'Accept-Language: en-US,en' \
--header 'Content-Type: application/json' \
--data '{
    "model": "glm-5",
    "messages": [
        {
            "role": "user",
            "content": "Write a poem about spring"
        }
    ],
    "stream": true
}'
```

### Multi-turn Conversation

```bash  theme={null}
curl --location 'https://api.z.ai/api/paas/v4/chat/completions' \
--header 'Authorization: Bearer YOUR_API_KEY' \
--header 'Accept-Language: en-US,en' \
--header 'Content-Type: application/json' \
--data '{
    "model": "glm-5",
    "messages": [
        {
            "role": "system",
            "content": "You are a professional programming assistant"
        },
        {
            "role": "user",
            "content": "What is recursion?"
        },
        {
            "role": "assistant",
            "content": "Recursion is a programming technique where a function calls itself to solve problems..."
        },
        {
            "role": "user",
            "content": "Can you give me an example of Python recursion?"
        }
    ]
}'
```

## Common Programming Language Examples

<Tabs>
  <Tab title="Python">
    ```python  theme={null}
    import requests
    import json

    def call_zai_api(messages, model="glm-5"):
        url = "https://api.z.ai/api/paas/v4/chat/completions"

        headers = {
            "Authorization": "Bearer YOUR_API_KEY",
            "Content-Type": "application/json",
            "Accept-Language": "en-US,en"
        }

        data = {
            "model": model,
            "messages": messages,
            "temperature": 1.0
        }

        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"API call failed: {response.status_code}, {response.text}")

    # Usage example
    messages = [
        {"role": "user", "content": "Hello, please introduce yourself"}
    ]

    result = call_zai_api(messages)
    print(result['choices'][0]['message']['content'])
    ```
  </Tab>

  <Tab title="JavaScript">
    ```javascript  theme={null}
    async function callZAPI(messages, model = 'glm-4.7') {
        const url = 'https://api.z.ai/api/paas/v4/chat/completions';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_API_KEY',
                'Content-Type': 'application/json',
                'Accept-Language': 'en-US,en'
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 1.0
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status}`);
        }

        return await response.json();
    }

    // Usage example
    const messages = [
        { role: 'user', content: 'Hello, please introduce yourself' }
    ];

    callZAPI(messages)
        .then(result => {
            console.log(result.choices[0].message.content);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    ```
  </Tab>

  <Tab title="Java">
    ```java  theme={null}
    import com.fasterxml.jackson.databind.ObjectMapper;
    import okhttp3.MediaType;
    import okhttp3.OkHttpClient;
    import okhttp3.Request;
    import okhttp3.RequestBody;
    import okhttp3.Response;
    import java.util.Collections;
    import java.util.HashMap;
    import java.util.Map;

    public class AgentExample {

        public static void main(String[] args) throws Exception {

            OkHttpClient client = new OkHttpClient();
            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> messages = new HashMap<>(8);
            messages.put("role", "user");
            messages.put("content", "Hello, please introduce yourself");
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "glm-5");
            requestBody.put("messages", Collections.singletonList(messages));
            requestBody.put("temperature", 1.0);

            String jsonBody = mapper.writeValueAsString(requestBody);
            MediaType JSON = MediaType.get("application/json; charset=utf-8");
            RequestBody body = RequestBody.create(JSON, jsonBody);
            Request request = new Request.Builder()
                .url("https://api.z.ai/api/paas/v4/chat/completions")
                .addHeader("Authorization", "Bearer your_api_key")
                .addHeader("Content-Type", "application/json")
                .addHeader("Accept-Language", "en-US,en")
                .post(body)
                .build();
            try (Response response = client.newCall(request).execute()) {
                System.out.println(response.body().string());
            }
        }
    }
    ```
  </Tab>
</Tabs>

## Best Practices

<CardGroup cols={2}>
  <Card title="Security" icon="shield">
    * Properly secure API Keys, do not hard-code them in your code
    * Use environment variables or configuration files to store sensitive information
    * Regularly rotate API Keys
  </Card>

  <Card title="Performance Optimization" icon="gauge-high">
    * Implement connection pooling and session reuse
    * Set reasonable timeout values
    * Use asynchronous requests for high-concurrency scenarios
  </Card>

  <Card title="Error Handling" icon="code">
    * Implement exponential backoff retry mechanisms
    * Log detailed error information
    * Set reasonable timeout and retry limits
  </Card>

  <Card title="Monitoring" icon="chart-line">
    * Monitor API call frequency and success rates
    * Track response times and error rates
    * Set up alerting mechanisms
  </Card>
</CardGroup>

## Get More

<CardGroup cols={2}>
  <Card title="API Documentation" icon="book" href="/api-reference">
    View complete API interface documentation and parameter descriptions
  </Card>

  <Card title="Technical Support" icon="headset" href="https://z.ai/contact">
    Get technical support and assistance
  </Card>
</CardGroup>

<Note>
  It is recommended to use HTTPS protocol in production environments and implement appropriate security measures to protect your API keys and data transmission.
</Note>


Built with [Mintlify](https://mintlify.com).
> ## Documentation Index
> Fetch the complete documentation index at: https://docs.z.ai/llms.txt
> Use this file to discover all available pages before exploring further.

# Introduction

<Info>
  The API reference describes the RESTful APIs you can use to interact with the Z.AI platform.
</Info>

Z.AI provides standard HTTP API interfaces that support multiple programming languages and development environments, with [SDKs](/guides/develop/python/introduction) also available.

## API Endpoint

Z.ai Platform's general API endpoint is as follows:

```
https://api.z.ai/api/paas/v4
```

<Warning>
  Note: When using the [GLM Coding Plan](/devpack/overview), you need to configure the dedicated \
  Coding endpoint - [https://api.z.ai/api/coding/paas/v4](https://api.z.ai/api/coding/paas/v4) \
  instead of the general endpoint - [https://api.z.ai/api/paas/v4](https://api.z.ai/api/paas/v4) \
  Note: The Coding API endpoint is only for Coding scenarios and is not applicable to general API scenarios. Please use them accordingly.
</Warning>

## Authentication

The Z.AI API uses the standard **HTTP Bearer** for authentication.
An API key is required, which you can create or manage on the [API Keys Page](https://z.ai/manage-apikey/apikey-list).

API keys should be provided via HTTP Bearer Authentication in HTTP Request Headers.

```
Authorization: Bearer ZAI_API_KEY
```

## Playground

The API Playground allows developers to quickly try out API calls. Simply click **Try it** on the API details page to get started.

* On the API details page, there are many interactive options, such as **switching input types**, **switching tabs**, and **adding new content**.
* You can click **Add an item** or **Add new property** to add more properties the API need.
* **Note** that when switching the tabs, the previous properties value you need re-input or re-switch.

## Call Examples

<Tabs>
  <Tab title="cURL">
    ```bash  theme={null}
    curl -X POST "https://api.z.ai/api/paas/v4/chat/completions" \
    -H "Content-Type: application/json" \
    -H "Accept-Language: en-US,en" \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -d '{
        "model": "glm-5",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful AI assistant."
            },
            {
                "role": "user",
                "content": "Hello, please introduce yourself."
            }
        ],
        "temperature": 1.0,
        "stream": true
    }'
    ```
  </Tab>

  <Tab title="Official Python SDK">
    **Install SDK**

    ```bash  theme={null}
    # Install latest version
    pip install zai-sdk

    # Or specify version
    pip install zai-sdk==0.1.0
    ```

    **Verify Installation**

    ```python  theme={null}
    import zai
    print(zai.__version__)
    ```

    **Usage Example**

    ```python  theme={null}
    from zai import ZaiClient

    # Initialize client
    client = ZaiClient(api_key="YOUR_API_KEY")

    # Create chat completion request
    response = client.chat.completions.create(
        model="glm-5",
        messages=[
            {
                "role": "system",
                "content": "You are a helpful AI assistant."
            },
            {
                "role": "user",
                "content": "Hello, please introduce yourself."
            }
        ]
    )

    # Get response
    print(response.choices[0].message.content)
    ```
  </Tab>

  <Tab title="Official Java SDK">
    **Install SDK**

    **Maven**

    ```xml  theme={null}
    <dependency>
        <groupId>ai.z.openapi</groupId>
        <artifactId>zai-sdk</artifactId>
        <version>0.3.0</version>
    </dependency>
    ```

    **Gradle (Groovy)**

    ```groovy  theme={null}
    implementation 'ai.z.openapi:zai-sdk:0.3.0'
    ```

    **Usage Example**

    ```java  theme={null}
    import ai.z.openapi.ZaiClient;
    import ai.z.openapi.service.model.*;
    import java.util.Arrays;

    public class QuickStart {
        public static void main(String[] args) {
            // Initialize client
            ZaiClient client = ZaiClient.builder().ofZAI()
                .apiKey("YOUR_API_KEY")
                .build();

            // Create chat completion request
            ChatCompletionCreateParams request = ChatCompletionCreateParams.builder()
                .model("glm-5")
                .messages(Arrays.asList(
                    ChatMessage.builder()
                        .role(ChatMessageRole.USER.value())
                        .content("Hello, who are you?")
                        .build()
                ))
                .stream(false)
                .build();

            // Send request
            ChatCompletionResponse response = client.chat().createChatCompletion(request);

            // Get response
            System.out.println(response.getData().getChoices().get(0).getMessage().getContent());
        }
    }
    ```
  </Tab>

  <Tab title="OpenAI Python SDK">
    **Install SDK**

    ```bash  theme={null}
    # Install or upgrade to latest version
    pip install --upgrade 'openai>=1.0'
    ```

    **Verify Installation**

    ```python  theme={null}
    python -c "import openai; print(openai.__version__)"
    ```

    **Usage Example**

    ```python  theme={null}
    from openai import OpenAI

    client = OpenAI(
        api_key="your-Z.AI-api-key",
        base_url="https://api.z.ai/api/paas/v4/"
    )

    completion = client.chat.completions.create(
        model="glm-5",
        messages=[
            {"role": "system", "content": "You are a smart and creative novelist"},
            {"role": "user", "content": "Please write a short fairy tale story as a fairy tale master"}
        ]
    )

    print(completion.choices[0].message.content)
    ```
  </Tab>

  <Tab title="OpenAI NodeJs SDK">
    **Install SDK**

    ```bash  theme={null}
    # Install or upgrade to latest version
    npm install openai

    # Or using yarn
    yarn add openai
    ```

    **Usage Example**

    ```javascript  theme={null}
    import OpenAI from "openai";

    const client = new OpenAI({
        apiKey: "your-Z.AI-api-key",
        baseURL: "https://api.z.ai/api/paas/v4/"
    });

    async function main() {
        const completion = await client.chat.completions.create({
            model: "glm-5",
            messages: [
                { role: "system", content: "You are a helpful AI assistant." },
                { role: "user", content: "Hello, please introduce yourself." }
            ]
        });

        console.log(completion.choices[0].message.content);
    }

    main();
    ```
  </Tab>

  <Tab title="OpenAI Java SDK">
    **Install SDK**

    **Maven**

    ```xml  theme={null}
    <dependency>
        <groupId>com.openai</groupId>
        <artifactId>openai-java</artifactId>
        <version>2.20.1</version>
    </dependency>
    ```

    **Gradle (Groovy)**

    ```groovy  theme={null}
    implementation 'com.openai:openai-java:2.20.1'
    ```

    **Usage Example**

    ```java  theme={null}
    import com.openai.client.OpenAIClient;
    import com.openai.client.okhttp.OpenAIOkHttpClient;
    import com.openai.models.chat.completions.ChatCompletion;
    import com.openai.models.chat.completions.ChatCompletionCreateParams;

    public class QuickStart {
        public static void main(String[] args) {
            // Initialize client
            OpenAIClient client = OpenAIOkHttpClient.builder()
                .apiKey("your-Z.AI-api-key")
                .baseUrl("https://api.z.ai/api/paas/v4/")
                .build();

            // Create chat completion request
            ChatCompletionCreateParams params = ChatCompletionCreateParams.builder()
                .addSystemMessage("You are a helpful AI assistant.")
                .addUserMessage("Hello, please introduce yourself.")
                .model("glm-5")
                .build();

            // Send request and get response
            ChatCompletion chatCompletion = client.chat().completions().create(params);
            Object response = chatCompletion.choices().get(0).message().content();

            System.out.println(response);
        }
    }
    ```
  </Tab>
</Tabs>


Built with [Mintlify](https://mintlify.com).
# RATE LIMITS [Z.AI](https://z.ai/manage-apikey/rate-limits)