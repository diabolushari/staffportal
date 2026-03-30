<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Grpc\ChannelCredentials;
use Illuminate\Http\JsonResponse;
use Proto\Parameters\ListParameterDomainsRequest;
use Proto\Parameters\ParameterDomainServiceClient;

class ParameterDomainListApiController extends Controller
{
    /** @var ParameterDomainServiceClient */
    private $client;

    public function __construct()
    {
        $this->client = new ParameterDomainServiceClient(config('app.consumer_service_grpc_host'), [
            'credentials' => ChannelCredentials::createInsecure(),
        ]);
    }

    public function __invoke(): JsonResponse
    {
        $request = new ListParameterDomainsRequest;

        [$response, $status] = $this->client->ListParameterDomains($request)->wait();

        if ($status->code !== 0) {
            return response()->json(['error' => $status->details], 500);
        }

        $domains = $response->getDomains(); // make sure this method exists in your generated proto
        $domainArray = [];

        foreach ($domains as $domain) {
            $domainArray[] = [
                'id' => $domain->getId(),
                'name' => $domain->getDomainName(),
                'description' => $domain->getDescription(),
                'code' => $domain->getDomainCode(),
            ];
        }

        return response()->json($domainArray);
    }
}
