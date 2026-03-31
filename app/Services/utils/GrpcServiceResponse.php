<?php

namespace App\Services\utils;

use Illuminate\Http\RedirectResponse;

/**
 * Unified wrapper for gRPC service layer responses.
 *
 * Controllers / callers can inspect:
 * - $success: boolean overall success flag
 * - $data: domain specific payload (array|null)
 * - $error: RedirectResponse|null (already prepared redirect with errors / flashes)
 * - $rawResponse: underlying gRPC response message (nullable)
 * - $statusCode: gRPC status code (int)
 * - $statusDetails: detailed status / message (string|null)
 */
class GrpcServiceResponse
{
    public readonly bool $success;

    /** @var array<int|string, mixed>|null Domain specific payload */
    public readonly ?array $data;

    public readonly ?RedirectResponse $error;

    /** @var object|null Underlying protobuf message */
    public readonly ?object $rawResponse;

    public readonly int $statusCode;

    public readonly ?string $statusDetails;

    /** @var array<string, string> */
    public readonly array $validationErrors;

    /**
     * @param  array<string|int, mixed>|null  $data
     * @param  array<string, string>|null  $validationErrors
     */
    private function __construct(
        bool $success,
        ?array $data = null,
        ?RedirectResponse $error = null,
        ?object $rawResponse = null,
        int $statusCode = 0,
        ?string $statusDetails = null,
        ?array $validationErrors = null,
    ) {
        $this->success = $success;
        $this->data = $data;
        $this->error = $error;
        $this->rawResponse = $rawResponse;
        $this->statusCode = $statusCode;
        $this->statusDetails = $statusDetails;
        $this->validationErrors = $validationErrors ?? [];
    }

    /**
     * @param  array<string|int, mixed>|null  $data
     */
    public static function success(
        ?array $data = null,
        ?object $rawResponse = null,
        int $statusCode = 0,
        ?string $statusDetails = null
    ): self {
        return new self(true, $data, null, $rawResponse, $statusCode, $statusDetails, []);
    }

    /**
     * @param  array<string|int, mixed>|null  $data
     * @param  array<string, string>|null  $validationErrors
     */
    public static function error(
        ?RedirectResponse $error,
        ?object $rawResponse = null,
        int $statusCode = 2,
        ?string $statusDetails = null,
        ?array $data = null,
        ?array $validationErrors = null,
    ): self {
        return new self(false, $data, $error, $rawResponse, $statusCode, $statusDetails, $validationErrors);
    }

    /** Quickly check if there is an error redirect */
    public function hasValidationError(): bool
    {
        return $this->error !== null;
    }
}
