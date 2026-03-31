<?php

namespace App\Services\Grpc;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GrpcErrorService
{
    public const VALIDATION_CODES = [3, 6, 9, 11, 13, 5];

    /**
     * Handle gRPC errors and return appropriate redirect response
     *
     * @param  object  $status  The gRPC status object
     */
    public static function handleErrorResponse(object $status, ?RedirectResponse $redirectResponse = null, bool $flashError = true): ?RedirectResponse
    {
        // Status code 0 means success, no error handling needed
        if ($status->code === 0) {
            return null;
        }

        // Check if this is a validation error (codes 3, 6, 9, 11)
        if (self::isValidationError($status->code)) {
            $validationErrors = self::convertToValidationError($status);
            if (! empty($validationErrors)) {
                return redirect()->back()->withErrors($validationErrors)->withInput();
            }
        }

        if ($status->code === 13) {
            $errors = GrpcErrorHandler::extractError($status);
            /** @var string[] $debug */
            $debug = [];
            foreach ($errors as $error) {
                if ($error['type'] === 'ErrorInfo' && isset($error['metadata'])) {
                    $debug[] = $error['metadata']['operation'].': '.$error['metadata']['cause'];
                    $debug[] = $error['metadata']['cause_message'];
                }
            }
            session()->flash('debug', $debug);
            Log::info($errors);
        }

        // For non-validation errors, flash error message to session
        $errorMessage = self::getErrorMessage($status);

        if ($flashError) {
            session()->flash('error', "$status->code: $errorMessage");
        }

        return $redirectResponse;
    }

    /**
     * Convert extracted gRPC errors to validation error format
     *
     * @param  object  $status  The gRPC status object
     * @return array<string, string> Associative array of field => error message
     */
    public static function convertToValidationError($status): array
    {
        $validationErrors = [];
        $extractedErrors = GrpcErrorHandler::extractError($status);
        foreach ($extractedErrors as $error) {
            if ($error['type'] === 'ErrorInfo' && isset($error['metadata'])) {
                $validationErrors = array_merge($validationErrors, self::processErrorInfo($error, $status->code));
            }

            if ($error['type'] === 'BadRequest' && isset($error['field']) && isset($error['message'])) {
                $fieldName = self::convertToSnakeCase($error['field']);
                $validationErrors[$fieldName] = $error['message'];
            }
        }

        return $validationErrors;
    }

    /**
     * Process ErrorInfo type errors based on status code
     *
     * @param  array{
     *   metadata: array{field?: string, message?: string, conflict_field?: string, conflict_value?: string}
     * }  $error
     * @return array<string, string>
     */
    private static function processErrorInfo(array $error, int $statusCode): array
    {
        $validationErrors = [];
        $metadata = $error['metadata'];

        if (
            in_array($statusCode, [3, 9, 11], true)
            && isset($metadata['field'], $metadata['message'])
        ) {
            $fieldName = self::convertToSnakeCase($metadata['field']);
            $validationErrors[$fieldName] = $metadata['message'];
        }

        if ($statusCode === 6 && isset($metadata['conflict_field'], $metadata['conflict_value'])) {
            $fieldName = self::convertToSnakeCase($metadata['conflict_field']);
            $conflictValue = $metadata['conflict_value'];
            $validationErrors[$fieldName] = "A record with this {$fieldName} '{$conflictValue}' already exists.";
        }

        return $validationErrors;
    }

    /**
     * Convert camelCase field names to snake_case
     */
    private static function convertToSnakeCase(string $fieldName): string
    {
        return Str::snake($fieldName);
    }

    /**
     * Check if the status code represents a validation error
     */
    public static function isValidationError(int $statusCode): bool
    {
        return in_array($statusCode, self::VALIDATION_CODES, true);
    }

    /**
     * Get user-friendly error message for non-validation errors
     *
     * @param  object  $status
     */
    private static function getErrorMessage($status): string
    {
        return match ($status->code) {
            1 => 'Request was cancelled.',
            2 => 'An unknown error occurred.',
            4 => 'Request timeout. Please try again.',
            5 => 'Resource not found.',
            7 => 'Permission denied.',
            8 => 'Service temporarily overloaded. Please try again later.',
            12 => 'Feature not implemented.',
            13 => 'Internal server error.',
            14 => 'Service temporarily unavailable.',
            15 => 'Data corruption detected.',
            16 => 'Authentication required.',
            default => $status->details ?? 'An error occurred while processing your request.',
        };
    }
}
