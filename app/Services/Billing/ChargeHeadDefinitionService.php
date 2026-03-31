<?php

namespace App\Services\Billing;

use App\GrpcConverters\Billing\ChargeHeadDefinitionConverter;
use App\Services\Grpc\GrpcErrorService;
use App\Services\utils\GrpcServiceResponse;
use Grpc\ChannelCredentials;
use Proto\Billing\ChargeHeadDefinitionServiceClient;
use Proto\Billing\GetChargeHeadDefinitionsRequest;

class ChargeHeadDefinitionService
{
    private ChargeHeadDefinitionServiceClient $client;

    public function __construct(
        private readonly ChargeHeadDefinitionConverter $chargeHeadDefinitionConverter
    ) {
        $this->client = new ChargeHeadDefinitionServiceClient(
            config('app.consumer_service_grpc_host'),
            ['credentials' => ChannelCredentials::createInsecure()]
        );
    }

    public function listChargeHeadByCategory(
        string $category
    ): GrpcServiceResponse {
        $request = new GetChargeHeadDefinitionsRequest;
        $request->setCategory($category);

        [$response, $status] = $this->client->GetChargeHeadDefinitions($request)->wait();

        if ($status->code !== 0) {
            return GrpcServiceResponse::error(
                GrpcErrorService::handleErrorResponse($status),
                $response,
                $status->code,
                $status->details
            );
        }
        $chargeHeadDefinitions = [];
        foreach ($response->getChargeHeadDefinitions() as $chargeHeadDefinition) {
            $chargeHeadDefinitions[] = $this->chargeHeadDefinitionConverter->convertToArray($chargeHeadDefinition);
        }

        return GrpcServiceResponse::success($chargeHeadDefinitions, $response, $status->code, $status->details);
    }
}
