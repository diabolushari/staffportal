# 📦 gRPC Integration with Laravel

This document explains how to integrate gRPC into your Laravel application and how to generate service files using `.proto` definitions.

---

## ✅ Prerequisites

Ensure the following are installed:

- Composer
- `protoc` (Protocol Buffers compiler)
- `grpc_php_plugin` for PHP code generation
- gRPC PHP libraries via Composer:

```bash
composer require google/protobuf
composer require grpc/grpc
```

---

## 🔌 Setting up gRPC in Laravel

1. **Install Required PHP Packages**

    Already done:

    ```bash
    composer require google/protobuf
    composer require grpc/grpc
    ```

2. **Enable gRPC Extension in PHP**

    Make sure your PHP has `grpc` extension enabled. In your `php.ini`, add:

    ```ini
    extension=grpc.so
    ```

    > ✅ You can verify using `php -m | grep grpc`

3. **Directory Structure**

    Create the following structure:

    ```bash
    mkdir -p proto generated/
    ```

---

## 🧬 Generating PHP gRPC Service Files from `.proto`

1. **Create **\`\`** File**

    Example: `proto/parameter.proto`

    ```proto
    syntax = "proto3";

    package parameter;

    service ParameterService {
      rpc GetParameter (ParameterRequest) returns (ParameterResponse);
    }

    message ParameterRequest {
      string key = 1;
    }

    message ParameterResponse {
      string value = 1;
    }
    ```

2. \*\*Generate PHP Code Using \*\*\`\`

    Run the following:

    ```bash
    protoc \
      --proto_path=./proto \
      --php_out=./generated \
      --grpc_out=./generated \
      --plugin=protoc-gen-grpc=$(which grpc_php_plugin) \
      ./proto/parameter.proto
    ```

    - `--php_out` generates PHP classes for messages
    - `--grpc_out` generates gRPC client/server stubs
    - Ensure `grpc_php_plugin` is in your system path

---
