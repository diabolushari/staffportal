<?php

namespace App\Http\Controllers\Consumers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Parties\PartiesFormRequest;
use App\Services\Parameters\ParameterValueService;
use App\Services\Parties\PartyService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class PartiesController extends Controller
{
    public function __construct(private PartyService $partyService,
        private ParameterValueService $parameterValueService) {}

    /**
     * Display a listing of the parties.
     */
    public function index(Request $request): Response|RedirectResponse
    {
        $search = $request->input('search') ?? null;
        $partiesResponse = $this->partyService->getParties($search);

        if ($partiesResponse->hasValidationError()) {
            return redirect()->back()->with('error', $partiesResponse->error ?? 'Failed to get parties.');
        }

        return Inertia::render('Parties/PartiesIndex', [
            'parties' => $partiesResponse,
        ]);
    }

    /**
     * Show the form for creating a new party.
     */
    public function create(): Response|RedirectResponse
    {
        $partyTypes = $this->parameterValueService->getParameterValues(null, null, null, 'Parties', 'Party Type');
        $partyStatus = $this->parameterValueService->getParameterValues(null, null, null, 'Parties', 'Status');

        return Inertia::render('Parties/PartiesCreate', [
            'partyTypes' => $partyTypes->data,
            'partyStatus' => $partyStatus->data,
        ]);
    }

    /**
     * Store a newly created party in storage.
     */
    public function store(PartiesFormRequest $request): RedirectResponse
    {
        $user = Auth::user();
        if ($user) {
            $request->createdBy = $user->id;
        }
        $response = $this->partyService->createParty($request);

        if ($response->hasValidationError()) {
            return redirect()->back()->with('error', $response->error ?? 'Failed to create party.');
        }

        return redirect()->route('parties.index')->with('success', 'Party created successfully.');
    }

    /**
     * Display the specified party.
     */
    public function show(int $id): Response|RedirectResponse
    {
        $partyResponse = $this->partyService->getParty($id);

        if ($partyResponse->hasValidationError()) {
            return redirect()->back()->with('error', $partyResponse->error ?? 'Failed to get party.');
        }

        return Inertia::render('Parties/PartiesShow', [
            'party' => $partyResponse->data,
        ]);
    }

    /**
     * Show the form for editing the specified party.
     */
    public function edit(int $id): Response|RedirectResponse
    {
        // First, get the specific party to edit
        $partyResponse = $this->partyService->getParty($id);
        if ($partyResponse->hasValidationError()) {
            return redirect()->back()->with('error', $partyResponse->error ?? 'Failed to get party.');
        }
        $party = $partyResponse->data;

        $partyTypes = $this->parameterValueService->getParameterValues(null, null, null, 'Parties', 'Party Type');
        $partyStatus = $this->parameterValueService->getParameterValues(null, null, null, 'Parties', 'Status');

        return Inertia::render('Parties/PartiesCreate', [
            'party' => $party,
            'partyTypes' => $partyTypes,
            'partyStatus' => $partyStatus,
        ]);
    }

    /**
     * Update the specified party in storage.
     */
    public function update(PartiesFormRequest $request, int $id): RedirectResponse
    {
        $request->versionId = $id;
        $user = Auth::user();
        if ($user) {
            $request->updatedBy = $user->id;
        }
        $response = $this->partyService->updateParty($request);

        if ($response->hasValidationError()) {
            return redirect()->back()->with('error', $response->error ?? 'Failed to update party.');
        }

        return redirect()->route('parties.index')->with('success', 'Party updated successfully.');
    }

    /**
     * Remove the specified party from storage.
     */
    public function destroy(int $id): RedirectResponse
    {
        $response = $this->partyService->deleteParty($id);

        if ($response->hasValidationError()) {
            return redirect()->back()->with('error', $response->error ?? 'Failed to delete party.');
        }

        return redirect()->route('parties.index')->with('success', 'Party deleted successfully.');
    }
}
