<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Grpc\ChannelCredentials;
use Illuminate\Http\JsonResponse;
use Proto\Modules\ListSystemModulesRequest;
use Proto\Modules\SystemModuleServiceClient;

class SystemModuleApiController extends Controller
{
    /** @var SystemModuleServiceClient */
    private $client;

    public function __construct()
    {
        $this->client = new SystemModuleServiceClient(config('app.consumer_service_grpc_host'), [
            'credentials' => ChannelCredentials::createInsecure(),
        ]);
    }

    public function __invoke(): JsonResponse
    {
        $req = new ListSystemModulesRequest;

        [$res, $status] = $this->client->ListSystemModules($req)->wait();

        if ($status->code !== 0) {
            return response()->json(['error' => $status->details], 500);
        }

        $systemModules = $res->getModules();

        $systemModulesArray = [];
        foreach ($systemModules as $systemModule) {
            $systemModulesArray[] = [
                'id' => $systemModule->getId(),
                'name' => $systemModule->getName(),
            ];
        }

        return response()->json($systemModulesArray);
    }
}
