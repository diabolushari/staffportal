<?php

namespace App\Http\Controllers\Connection;

use App\Http\Controllers\Controller;
use App\Services\Connection\ConnectionPartiesMappingService;
use App\Services\Connection\ConnectionService;
use App\Services\Parameters\ParameterValueService;
use App\Services\Parties\PartyService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class GetConnectionPartyController extends Controller
{
    public function __construct(private readonly ConnectionService $connectionService,
        private readonly PartyService $partyService, private readonly ConnectionPartiesMappingService $connectionPartiesMappingService, private readonly ParameterValueService $parameterValueService) {}

    public function __invoke(int $connectionId, Request $request): Response
    {
        $connection = $this->connectionService->getConnection($connectionId);
        $parties = $this->partyService->getParties(null);
        $connectionParties = $this->connectionPartiesMappingService->listConnectionParties($connectionId, null);

        $partyRelationTypes = $this->parameterValueService->getParameterValues(null,null,null,'Parties','Party Relation Type');

        return Inertia::render('Connections/ConnectionParties', [
            'connection' => $connection->data,
            'parties' => $parties->data,
            'connection_parties' => $connectionParties->data,
            'party_relation_types' => $partyRelationTypes->data,
        ]);
    }
}
