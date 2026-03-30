<?php

namespace App\Services\Grpc;

use Google\Rpc\BadRequest;
use Google\Rpc\ErrorInfo;
use Google\Rpc\Status as RpcStatus;
use Illuminate\Support\Facades\Log;

class GrpcErrorHandler
{
    /**
     * @param  mixed  $status  The gRPC status object
     * @return array<int, array{
     *  type: string,
     *  reason?: string,
     *  field?: string,
     *  domain?: string,
     *  message?: string,
     *  metadata?: array<string, string>,
     * }>
     */
    public static function extractError($status): array
    {
        $errors = [];

        // Extract errors from grpc-status-details-bin if present
        if (isset($status->metadata['grpc-status-details-bin'])) {
            $binaryData = $status->metadata['grpc-status-details-bin'][0];
            $rpcStatus = new RpcStatus;
            $rpcStatus->mergeFromString($binaryData);

            foreach ($rpcStatus->getDetails() as $any) {
                $typeUrl = $any->getTypeUrl();

                /* ── google.rpc.ErrorInfo ──────────────────────────────────────────────── */
                if (str_ends_with($typeUrl, 'google.rpc.ErrorInfo')) {
                    $info = new ErrorInfo;
                    $info->mergeFromString($any->getValue());

                    $meta = iterator_to_array($info->getMetadata());
                    Log::info('Metadata extracted: ', $meta);

                    $errors[] = [
                        'type' => 'ErrorInfo',
                        'reason' => $info->getReason(),
                        'domain' => $info->getDomain(),
                        'metadata' => [
                            ...$meta,
                        ],

                    ];

                    continue;
                }

                /* ── google.rpc.BadRequest ────────────────────────────────────────────── */
                if (str_ends_with($typeUrl, 'google.rpc.BadRequest')) {
                    $badReq = new BadRequest;
                    $badReq->mergeFromString($any->getValue());

                    foreach ($badReq->getFieldViolations() as $v) {
                        $errors[] = [
                            'type' => 'BadRequest',
                            'field' => $v->getField(),
                            'message' => $v->getDescription(),
                        ];
                    }
                }
            }
        }

        return $errors;
    }
}
