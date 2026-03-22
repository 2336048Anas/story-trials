import type {
  User,
  Trial,
  Submission,
  DataAsset,
  License,
  RoyaltyEvent,
  Payout,
  UserProfile,
  UserSubmission,
} from '@/types/api';

// ── Realistic wallet addresses ──────────────────────────────────────────────
const WALLETS = {
  alice: '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD28',
  bob: '0x8ba1f109551bD432803012645Hac136c22C4FEB',
  carol: '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
  dave: '0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C',
  eve: '0x53d284357ec70CE289D6D64134DfAc8E511c8a3D',
};

// ── Users ───────────────────────────────────────────────────────────────────
export const mockUsers: Record<string, UserProfile> = {
  [WALLETS.alice]: {
    id: 'usr_01HZQ8K3M7RJXG5A2BCDN9PQVW',
    createdAt: '2025-09-15T10:30:00Z',
    updatedAt: '2026-01-20T14:15:00Z',
    email: 'alice@pharmaresearch.io',
    name: 'Dr. Alice Chen',
    role: 'BUYER',
    walletAddress: WALLETS.alice,
    _count: { assets: 3, trials: 2, submissions: 0 },
  },
  [WALLETS.bob]: {
    id: 'usr_01HZQ8K4N8SKYH6B3CEOE0QRWX',
    createdAt: '2025-10-02T08:00:00Z',
    updatedAt: '2026-02-10T09:45:00Z',
    name: 'Bob Martinez',
    role: 'CONTRIBUTOR',
    walletAddress: WALLETS.bob,
    _count: { assets: 1, trials: 0, submissions: 4 },
  },
  [WALLETS.carol]: {
    id: 'usr_01HZQ8K5P9TLZI7C4DFPF1RSXY',
    createdAt: '2025-11-18T12:00:00Z',
    updatedAt: '2026-03-01T16:30:00Z',
    name: 'Carol Washington',
    role: 'CONTRIBUTOR',
    walletAddress: WALLETS.carol,
    _count: { assets: 2, trials: 0, submissions: 3 },
  },
};

// ── Data Assets ─────────────────────────────────────────────────────────────
export const mockAssets: DataAsset[] = [
  {
    id: 'ast_01HZQCARDIO50K',
    createdAt: '2025-10-01T09:00:00Z',
    updatedAt: '2025-10-01T09:05:00Z',
    ownerId: mockUsers[WALLETS.alice].id,
    title: 'UK Biobank Cardiovascular Synthetic Cohort (N=50,000)',
    description:
      'Synthetically generated cardiovascular health records modelled on the UK Biobank structure. Includes blood pressure readings, lipid panels, ECG intervals, and 10-year ASCVD risk scores. Differentially private (ε=1.0).',
    ipfsCid: 'QmX7bVbSnVSxqR9HdG4BZe8YEiFkG3RLBF2jNsGtrK8uvP',
    metadataCid: 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG',
    isListed: true,
    ipAssetId: '0xA1B2C3D4E5F67890abcdef1234567890ABCDEF01',
    storyChainId: 1315,
    storyTxHash: '0x9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    tokenId: '47',
    licenseTermsId: '12',
    owner: { id: mockUsers[WALLETS.alice].id, walletAddress: WALLETS.alice, name: 'Dr. Alice Chen' },
  },
  {
    id: 'ast_02HZQDIAB25K',
    createdAt: '2025-11-12T14:30:00Z',
    updatedAt: '2025-11-12T14:35:00Z',
    ownerId: mockUsers[WALLETS.alice].id,
    title: 'Type 2 Diabetes Progression Dataset (N=25,000)',
    description:
      'Longitudinal synthetic patient records tracking HbA1c, fasting glucose, BMI, medication changes, and microvascular complication onset over 8 simulated years. HIPAA Safe Harbor compliant generation.',
    ipfsCid: 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX',
    metadataCid: 'QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn',
    isListed: true,
    ipAssetId: '0xB2C3D4E5F6789012bcdef23456789012BCDEF012',
    storyChainId: 1315,
    storyTxHash: '0x3c9909afec25354d551dae21590bb26e38d53f2173b8d3dc3eee4c047e7ab1c1',
    tokenId: '48',
    licenseTermsId: '12',
    owner: { id: mockUsers[WALLETS.alice].id, walletAddress: WALLETS.alice, name: 'Dr. Alice Chen' },
  },
  {
    id: 'ast_03HZQMENTALH10K',
    createdAt: '2025-12-05T11:00:00Z',
    updatedAt: '2025-12-05T11:05:00Z',
    ownerId: mockUsers[WALLETS.carol].id,
    title: 'Adolescent Mental Health Survey Synthetic Data (N=10,000)',
    description:
      'Synthetic survey responses modelled on PHQ-9, GAD-7, and demographic questionnaires for ages 13-19. Designed for anxiety/depression screening algorithm development.',
    ipfsCid: 'QmRf22bZar3WKmojipms22PkXH1MZGmvsqzQtuSvQE3uhS',
    metadataCid: 'QmPZ9gcCEpqKTo6aq8SzJQgd3ZLNRZR3YCZ5PZe1uLVKzA',
    isListed: true,
    ipAssetId: '0xC3D4E5F67890123cdef345678901234CDEF0123',
    storyChainId: 1315,
    storyTxHash: '0x7b502c3a1f48c8609ae212cdfb639dee39673f5e98d6782c6e1b345678901234',
    tokenId: '52',
    licenseTermsId: '14',
    owner: { id: mockUsers[WALLETS.carol].id, walletAddress: WALLETS.carol, name: 'Carol Washington' },
  },
  {
    id: 'ast_04HZQGENOMICS5K',
    createdAt: '2026-01-18T16:20:00Z',
    updatedAt: '2026-01-18T16:25:00Z',
    ownerId: mockUsers[WALLETS.carol].id,
    title: 'Pharmacogenomics Variant Panel (N=5,000)',
    description:
      'Synthetic genotype data for 42 clinically actionable pharmacogenes (CYP2D6, CYP2C19, VKORC1, etc.) with matched drug response phenotypes. Format: VCF + JSON clinical annotations.',
    ipfsCid: 'QmW2WQi7j6c7UgJTarActp7tDNikE4B2qXtFCfLPdsgaTQ',
    metadataCid: 'QmNRCQWfgze6AbBCaT1rkrkV5tJ2pF4RE3VwVNx7jZb4C7',
    isListed: true,
    ipAssetId: '0xD4E5F678901234def4567890123456DEF01234A',
    storyChainId: 1315,
    storyTxHash: '0x2c624232cdd221771294dfbb310aca000a0df6ac8b166e8e69c3e39a0b5e29f2',
    tokenId: '55',
    licenseTermsId: '14',
    owner: { id: mockUsers[WALLETS.carol].id, walletAddress: WALLETS.carol, name: 'Carol Washington' },
  },
  {
    id: 'ast_05HZQEHR100K',
    createdAt: '2026-02-08T10:00:00Z',
    updatedAt: '2026-02-08T10:05:00Z',
    ownerId: mockUsers[WALLETS.bob].id,
    title: 'Primary Care EHR Extract – Synthea (N=100,000)',
    description:
      'Full synthetic EHR dataset generated with Synthea covering conditions, medications, observations, procedures, and encounters. FHIR R4 compliant bundles.',
    ipfsCid: 'QmeSJN3z7ZEcXiYv3LPfBkXK1F8dXoK2uh1x5qW6rmNqya',
    metadataCid: 'QmVLDAhCY3X9P2uqMat7fCHTRC5V7T48m2NoH4iJPDTm3Q',
    isListed: true,
    ipAssetId: '0xE5F6789012345ef56789012345678EF012345AB',
    storyChainId: 1315,
    storyTxHash: '0x4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce',
    tokenId: '58',
    licenseTermsId: '12',
    owner: { id: mockUsers[WALLETS.bob].id, walletAddress: WALLETS.bob, name: 'Bob Martinez' },
  },
  {
    id: 'ast_06HZQWEARABLE20K',
    createdAt: '2026-03-02T13:45:00Z',
    updatedAt: '2026-03-02T13:50:00Z',
    ownerId: mockUsers[WALLETS.alice].id,
    title: 'Wearable Sensor Timeseries – Heart Rate & Activity (N=20,000)',
    description:
      'Synthetic minute-level heart rate, step count, and sleep stage data resembling Fitbit/Apple Watch output. 90-day windows per patient. Suitable for AF detection model training.',
    ipfsCid: 'QmfGBRT6S4HHXGhHhZ1FDqIpJbR5EXNTUnVcpR3vEm2gWy',
    metadataCid: 'QmQPeNsJPyVWPFDVHb77w8G42Fvo15z4bG2X8D2GhfbSXc',
    isListed: true,
    ipAssetId: '0xF67890123456f0678901234567890F0123456BC',
    storyChainId: 1315,
    storyTxHash: '0x6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b',
    tokenId: '61',
    licenseTermsId: '12',
    owner: { id: mockUsers[WALLETS.alice].id, walletAddress: WALLETS.alice, name: 'Dr. Alice Chen' },
  },
];

// ── Trials ──────────────────────────────────────────────────────────────────
export const mockTrials: Trial[] = [
  {
    id: 'tri_01HZQCOVID_LONG',
    createdAt: '2025-11-01T08:00:00Z',
    updatedAt: '2026-01-15T12:00:00Z',
    title: 'Long COVID Symptom Trajectory Study',
    description:
      'Seeking synthetic patient timelines showing post-COVID symptom evolution (fatigue, brain fog, cardiopulmonary) over 12+ months. Must include at least 5 timepoints per patient.',
    rewardUsd: 50000, // $500.00
    isOpen: true,
    buyerId: WALLETS.alice,
    buyer: { id: mockUsers[WALLETS.alice].id, name: 'Dr. Alice Chen', walletAddress: WALLETS.alice },
    _count: { submissions: 3 },
  },
  {
    id: 'tri_02HZQRAREDIS',
    createdAt: '2025-12-10T10:00:00Z',
    updatedAt: '2026-02-20T09:00:00Z',
    title: 'Rare Disease Phenotype Matching Dataset',
    description:
      'Need synthetic records for ≥15 rare diseases (prevalence <1:10,000) with complete phenotype coding (HPO terms), age of onset, and diagnostic odyssey timelines.',
    rewardUsd: 75000, // $750.00
    isOpen: true,
    buyerId: WALLETS.alice,
    buyer: { id: mockUsers[WALLETS.alice].id, name: 'Dr. Alice Chen', walletAddress: WALLETS.alice },
    _count: { submissions: 1 },
  },
  {
    id: 'tri_03HZQPEDIATRIC',
    createdAt: '2026-01-05T14:00:00Z',
    updatedAt: '2026-03-10T11:00:00Z',
    title: 'Pediatric Vaccination Response Profiles',
    description:
      'Synthetic immunisation records with antibody titre trajectories for standard childhood vaccines (MMR, DTaP, IPV). Include demographic confounders and adverse event flags.',
    rewardUsd: 35000, // $350.00
    isOpen: false,
    buyerId: WALLETS.alice,
    buyer: { id: mockUsers[WALLETS.alice].id, name: 'Dr. Alice Chen', walletAddress: WALLETS.alice },
    _count: { submissions: 5 },
  },
  {
    id: 'tri_04HZQONCOLOGY',
    createdAt: '2026-02-14T09:00:00Z',
    updatedAt: '2026-03-14T09:00:00Z',
    title: 'Oncology Treatment Outcome Prediction Data',
    description:
      'Synthetic cancer registry data with tumour staging, treatment regimens (chemo, radiation, surgery combinations), and 5-year survival outcomes for breast, lung, and colorectal cancers.',
    rewardUsd: 100000, // $1000.00
    isOpen: true,
    buyerId: WALLETS.alice,
    buyer: { id: mockUsers[WALLETS.alice].id, name: 'Dr. Alice Chen', walletAddress: WALLETS.alice },
    _count: { submissions: 2 },
  },
];

// ── Submissions ─────────────────────────────────────────────────────────────
export const mockSubmissions: Record<string, Submission[]> = {
  tri_01HZQCOVID_LONG: [
    {
      id: 'sub_01A',
      createdAt: '2025-12-01T10:00:00Z',
      updatedAt: '2025-12-15T10:00:00Z',
      userId: WALLETS.bob,
      trialId: 'tri_01HZQCOVID_LONG',
      dataCid: 'QmSynLongCovid01BobMartinez2025',
      assetId: 'ast_05HZQEHR100K',
      status: 'APPROVED',
      user: { id: mockUsers[WALLETS.bob].id, name: 'Bob Martinez', walletAddress: WALLETS.bob },
      asset: mockAssets[4],
    },
    {
      id: 'sub_01B',
      createdAt: '2025-12-20T14:00:00Z',
      updatedAt: '2026-01-05T09:00:00Z',
      userId: WALLETS.carol,
      trialId: 'tri_01HZQCOVID_LONG',
      dataCid: 'QmSynLongCovid02CarolWash2025',
      status: 'APPROVED',
      user: { id: mockUsers[WALLETS.carol].id, name: 'Carol Washington', walletAddress: WALLETS.carol },
    },
    {
      id: 'sub_01C',
      createdAt: '2026-01-10T11:00:00Z',
      updatedAt: '2026-01-10T11:00:00Z',
      userId: WALLETS.dave,
      trialId: 'tri_01HZQCOVID_LONG',
      dataCid: 'QmSynLongCovid03DaveAnon2026',
      status: 'PENDING',
      user: { id: 'usr_dave', name: undefined, walletAddress: WALLETS.dave },
    },
  ],
  tri_02HZQRAREDIS: [
    {
      id: 'sub_02A',
      createdAt: '2026-01-25T08:30:00Z',
      updatedAt: '2026-01-25T08:30:00Z',
      userId: WALLETS.bob,
      trialId: 'tri_02HZQRAREDIS',
      dataCid: 'QmSynRareDis01BobMart2026',
      status: 'PENDING',
      user: { id: mockUsers[WALLETS.bob].id, name: 'Bob Martinez', walletAddress: WALLETS.bob },
    },
  ],
  tri_03HZQPEDIATRIC: [
    {
      id: 'sub_03A',
      createdAt: '2026-01-20T10:00:00Z',
      updatedAt: '2026-02-01T10:00:00Z',
      userId: WALLETS.bob,
      trialId: 'tri_03HZQPEDIATRIC',
      dataCid: 'QmSynPediatric01Bob2026',
      status: 'APPROVED',
      user: { id: mockUsers[WALLETS.bob].id, name: 'Bob Martinez', walletAddress: WALLETS.bob },
    },
    {
      id: 'sub_03B',
      createdAt: '2026-02-05T09:00:00Z',
      updatedAt: '2026-02-10T09:00:00Z',
      userId: WALLETS.carol,
      trialId: 'tri_03HZQPEDIATRIC',
      dataCid: 'QmSynPediatric02Carol2026',
      status: 'APPROVED',
      user: { id: mockUsers[WALLETS.carol].id, name: 'Carol Washington', walletAddress: WALLETS.carol },
    },
    {
      id: 'sub_03C',
      createdAt: '2026-02-12T14:00:00Z',
      updatedAt: '2026-02-20T14:00:00Z',
      userId: WALLETS.dave,
      trialId: 'tri_03HZQPEDIATRIC',
      dataCid: 'QmSynPediatric03Dave2026',
      status: 'REJECTED',
      user: { id: 'usr_dave', walletAddress: WALLETS.dave },
    },
    {
      id: 'sub_03D',
      createdAt: '2026-02-25T11:00:00Z',
      updatedAt: '2026-03-05T11:00:00Z',
      userId: WALLETS.eve,
      trialId: 'tri_03HZQPEDIATRIC',
      dataCid: 'QmSynPediatric04Eve2026',
      status: 'APPROVED',
      user: { id: 'usr_eve', name: undefined, walletAddress: WALLETS.eve },
    },
    {
      id: 'sub_03E',
      createdAt: '2026-03-01T16:00:00Z',
      updatedAt: '2026-03-08T16:00:00Z',
      userId: WALLETS.bob,
      trialId: 'tri_03HZQPEDIATRIC',
      dataCid: 'QmSynPediatric05Bob2026v2',
      assetId: 'ast_05HZQEHR100K',
      status: 'APPROVED',
      user: { id: mockUsers[WALLETS.bob].id, name: 'Bob Martinez', walletAddress: WALLETS.bob },
      asset: mockAssets[4],
    },
  ],
  tri_04HZQONCOLOGY: [
    {
      id: 'sub_04A',
      createdAt: '2026-02-28T10:00:00Z',
      updatedAt: '2026-02-28T10:00:00Z',
      userId: WALLETS.carol,
      trialId: 'tri_04HZQONCOLOGY',
      dataCid: 'QmSynOnc01Carol2026',
      status: 'PENDING',
      user: { id: mockUsers[WALLETS.carol].id, name: 'Carol Washington', walletAddress: WALLETS.carol },
    },
    {
      id: 'sub_04B',
      createdAt: '2026-03-10T08:00:00Z',
      updatedAt: '2026-03-10T08:00:00Z',
      userId: WALLETS.bob,
      trialId: 'tri_04HZQONCOLOGY',
      dataCid: 'QmSynOnc02Bob2026',
      status: 'PENDING',
      user: { id: mockUsers[WALLETS.bob].id, name: 'Bob Martinez', walletAddress: WALLETS.bob },
    },
  ],
};

// ── Licenses ────────────────────────────────────────────────────────────────
export const mockLicenses: License[] = [
  {
    id: 'lic_01CARDIO_BOB',
    createdAt: '2025-10-20T15:00:00Z',
    updatedAt: '2025-10-20T15:05:00Z',
    status: 'ISSUED',
    assetId: 'ast_01HZQCARDIO50K',
    buyerId: mockUsers[WALLETS.bob].id,
    txHash: '0xabc123def456789012345678901234567890abcdef1234567890abcdef123456',
    chainLicenseId: '0x1234567890abcdef1234567890abcdef12345678',
    asset: {
      id: 'ast_01HZQCARDIO50K',
      title: 'UK Biobank Cardiovascular Synthetic Cohort (N=50,000)',
      ipfsCid: 'QmX7bVbSnVSxqR9HdG4BZe8YEiFkG3RLBF2jNsGtrK8uvP',
      isListed: true,
      ipAssetId: '0xA1B2C3D4E5F67890abcdef1234567890ABCDEF01',
      storyChainId: 1315,
      owner: { id: mockUsers[WALLETS.alice].id, walletAddress: WALLETS.alice, name: 'Dr. Alice Chen' },
    },
    buyer: { id: mockUsers[WALLETS.bob].id, walletAddress: WALLETS.bob, name: 'Bob Martinez' },
    payment: { id: 'pay_01', amount: 15000, currency: 'USD' },
  },
  {
    id: 'lic_02MENTALH_BOB',
    createdAt: '2026-01-05T10:00:00Z',
    updatedAt: '2026-01-05T10:05:00Z',
    status: 'ISSUED',
    assetId: 'ast_03HZQMENTALH10K',
    buyerId: mockUsers[WALLETS.bob].id,
    txHash: '0xdef456789012345678901234567890abcdef1234567890abcdef123456789012',
    chainLicenseId: '0x2345678901abcdef2345678901abcdef23456789',
    expiresAt: '2027-01-05T10:00:00Z',
    asset: {
      id: 'ast_03HZQMENTALH10K',
      title: 'Adolescent Mental Health Survey Synthetic Data (N=10,000)',
      ipfsCid: 'QmRf22bZar3WKmojipms22PkXH1MZGmvsqzQtuSvQE3uhS',
      isListed: true,
      ipAssetId: '0xC3D4E5F67890123cdef345678901234CDEF0123',
      storyChainId: 1315,
      owner: { id: mockUsers[WALLETS.carol].id, walletAddress: WALLETS.carol, name: 'Carol Washington' },
    },
    buyer: { id: mockUsers[WALLETS.bob].id, walletAddress: WALLETS.bob, name: 'Bob Martinez' },
    payment: { id: 'pay_02', amount: 8500, currency: 'USD' },
  },
  {
    id: 'lic_03DIAB_CAROL',
    createdAt: '2026-02-14T12:00:00Z',
    updatedAt: '2026-02-14T12:05:00Z',
    status: 'ISSUED',
    assetId: 'ast_02HZQDIAB25K',
    buyerId: mockUsers[WALLETS.carol].id,
    txHash: '0x789012345678901234567890abcdef1234567890abcdef12345678901234abcd',
    asset: {
      id: 'ast_02HZQDIAB25K',
      title: 'Type 2 Diabetes Progression Dataset (N=25,000)',
      ipfsCid: 'QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxX',
      isListed: true,
      ipAssetId: '0xB2C3D4E5F6789012bcdef23456789012BCDEF012',
      storyChainId: 1315,
      owner: { id: mockUsers[WALLETS.alice].id, walletAddress: WALLETS.alice, name: 'Dr. Alice Chen' },
    },
    buyer: { id: mockUsers[WALLETS.carol].id, walletAddress: WALLETS.carol, name: 'Carol Washington' },
    payment: { id: 'pay_03', amount: 12000, currency: 'USD' },
  },
  {
    id: 'lic_04CARDIO_REVOKED',
    createdAt: '2025-09-30T09:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    status: 'REVOKED',
    assetId: 'ast_01HZQCARDIO50K',
    buyerId: mockUsers[WALLETS.carol].id,
    asset: {
      id: 'ast_01HZQCARDIO50K',
      title: 'UK Biobank Cardiovascular Synthetic Cohort (N=50,000)',
      ipfsCid: 'QmX7bVbSnVSxqR9HdG4BZe8YEiFkG3RLBF2jNsGtrK8uvP',
      isListed: true,
      ipAssetId: '0xA1B2C3D4E5F67890abcdef1234567890ABCDEF01',
      storyChainId: 1315,
      owner: { id: mockUsers[WALLETS.alice].id, walletAddress: WALLETS.alice, name: 'Dr. Alice Chen' },
    },
    buyer: { id: mockUsers[WALLETS.carol].id, walletAddress: WALLETS.carol, name: 'Carol Washington' },
  },
];

// ── Royalty Events ──────────────────────────────────────────────────────────
export const mockRoyalties: RoyaltyEvent[] = [
  {
    id: 'roy_01',
    createdAt: '2025-10-25T12:00:00Z',
    licenseId: 'lic_01CARDIO_BOB',
    recipientId: mockUsers[WALLETS.alice].id,
    amount: 7500,
    currency: 'USD',
    note: 'Initial licensing royalty – Cardiovascular cohort',
    payoutId: 'payout_01',
    license: { id: 'lic_01CARDIO_BOB', asset: { id: 'ast_01HZQCARDIO50K', title: 'UK Biobank Cardiovascular Synthetic Cohort (N=50,000)' } },
    payout: { id: 'payout_01', status: 'PAID' },
  },
  {
    id: 'roy_02',
    createdAt: '2026-01-10T09:00:00Z',
    licenseId: 'lic_02MENTALH_BOB',
    recipientId: mockUsers[WALLETS.carol].id,
    amount: 4250,
    currency: 'USD',
    note: 'Licensing royalty – Mental Health survey data',
    payoutId: 'payout_02',
    license: { id: 'lic_02MENTALH_BOB', asset: { id: 'ast_03HZQMENTALH10K', title: 'Adolescent Mental Health Survey Synthetic Data (N=10,000)' } },
    payout: { id: 'payout_02', status: 'PAID' },
  },
  {
    id: 'roy_03',
    createdAt: '2026-02-20T14:00:00Z',
    licenseId: 'lic_03DIAB_CAROL',
    recipientId: mockUsers[WALLETS.alice].id,
    amount: 6000,
    currency: 'USD',
    note: 'Licensing royalty – Diabetes progression dataset',
    license: { id: 'lic_03DIAB_CAROL', asset: { id: 'ast_02HZQDIAB25K', title: 'Type 2 Diabetes Progression Dataset (N=25,000)' } },
  },
  {
    id: 'roy_04',
    createdAt: '2026-03-05T11:00:00Z',
    licenseId: 'lic_01CARDIO_BOB',
    recipientId: mockUsers[WALLETS.alice].id,
    amount: 3000,
    currency: 'USD',
    note: 'Quarterly usage royalty – Cardiovascular cohort',
    license: { id: 'lic_01CARDIO_BOB', asset: { id: 'ast_01HZQCARDIO50K', title: 'UK Biobank Cardiovascular Synthetic Cohort (N=50,000)' } },
  },
];

// ── Payouts ─────────────────────────────────────────────────────────────────
export const mockPayouts: Payout[] = [
  {
    id: 'payout_01',
    createdAt: '2025-11-01T10:00:00Z',
    updatedAt: '2025-11-01T10:05:00Z',
    recipientId: mockUsers[WALLETS.alice].id,
    amount: 7500,
    currency: 'USD',
    status: 'PAID',
    reference: '0xe3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    events: [{ id: 'roy_01', amount: 7500, currency: 'USD', licenseId: 'lic_01CARDIO_BOB' }],
  },
  {
    id: 'payout_02',
    createdAt: '2026-01-15T12:00:00Z',
    updatedAt: '2026-01-15T12:05:00Z',
    recipientId: mockUsers[WALLETS.carol].id,
    amount: 4250,
    currency: 'USD',
    status: 'PAID',
    reference: '0xd7a8fbb307d7809469ca9abcb0082e4f8d5651e46d3cdb762d02d0bf37c9e592',
    events: [{ id: 'roy_02', amount: 4250, currency: 'USD', licenseId: 'lic_02MENTALH_BOB' }],
  },
];

// ── Helper: get all submissions for a user (across all trials) ──────────────
export function getUserSubmissions(walletAddress: string): UserSubmission[] {
  const results: UserSubmission[] = [];
  for (const [trialId, subs] of Object.entries(mockSubmissions)) {
    const trial = mockTrials.find((t) => t.id === trialId);
    for (const sub of subs) {
      if (sub.userId === walletAddress) {
        results.push({
          ...sub,
          trial: trial
            ? { id: trial.id, title: trial.title, rewardUsd: trial.rewardUsd, isOpen: trial.isOpen }
            : undefined,
        });
      }
    }
  }
  return results;
}
