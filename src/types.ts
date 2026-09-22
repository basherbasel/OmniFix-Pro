export type MobileOperatingSystem = 'android' | 'ios' | 'harmonyos' | 'kaios' | 'feature_phone' | 'hyperos' | 'aosp';
export type ChipsetArchitecture = 'qualcomm_snapdragon' | 'mediatek_dimensity' | 'apple_silicon' | 'samsung_exynos' | 'google_tensor' | 'hisilicon_kirin' | 'unisoc_spd' | 'generic';
export type DeviceBootMode = 'normal' | 'recovery' | 'fastboot' | 'fastbootd' | 'edl_9008' | 'mtk_brom' | 'mtk_meta' | 'apple_dfu' | 'apple_recovery' | 'samsung_odin' | 'spd_diag' | 'huawei_usb_com';

export interface DeviceInfo {
  brand: string;
  model: string;
  manufacturer: string;
  osType?: MobileOperatingSystem;
  osVersion?: string;
  androidVersion: string;
  sdkLevel: number;
  buildNumber: string;
  serialNumber: string;
  imei1?: string;
  imei2?: string;
  ecid?: string; // Apple Unique Identifier
  udid?: string; // Apple UDID
  batteryLevel: number;
  batteryHealth?: number;
  isRooted: boolean;
  isJailbroken?: boolean;
  bootloaderUnlocked: boolean;
  bootMode?: DeviceBootMode;
  cpuAbi: string;
  chipset: string;
  chipsetFamily?: ChipsetArchitecture;
  basebandVersion?: string;
  modemStatus?: 'normal' | 'unknown' | 'panic' | 'no_service' | 'corrupted_nv';
  carrier: string;
  simLockStatus?: 'unlocked' | 'carrier_locked' | 'esim_only' | 'r_sim';
  supportedBands?: string[];
  currentLocale: string;
  supportedLocalesCount: number;
  hasArabicInSystem: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected' | 'unauthorized';
  connectionType: 'webusb' | 'simulated' | 'wifi_adb' | 'usbmuxd' | 'serial_com';
  customRom?: string;
  notes?: string;
}

export interface UniversalBoxTask {
  id: string;
  title: string;
  category: 'flashing' | 'recovery_loop' | 'error_code_repair' | 'baseband_imei' | 'network_volte' | 'bypass_diag' | 'testpoint' | 'partition';
  targetOs: MobileOperatingSystem;
  targetChipset: ChipsetArchitecture;
  description: string;
  difficulty: 'easy' | 'medium' | 'advanced' | 'expert';
  successRate: number;
  riskLevel: 'safe' | 'low' | 'moderate' | 'requires_backup';
  requiredMode: DeviceBootMode;
  steps: {
    stepIndex: number;
    title: string;
    action: string;
    protocolCommand?: string;
    expectedOutcome: string;
  }[];
}

export interface HardwareTestPoint {
  id: string;
  deviceName: string;
  brand: string;
  chipset: string;
  modeTarget: 'EDL 9008' | 'Huawei USB COM 1.0' | 'MTK BROM Force' | 'SPD Diag';
  pinoutDescription: string;
  shortGroundInstruction: string;
  voltageWarning: string;
  diagramSvgKey: string;
}

export interface UniversalErrorCode {
  code: string;
  sourceTool: 'iTunes / 3uTools' | 'Samsung Odin' | 'Qualcomm QFIL' | 'MediaTek SP Flash' | 'Unisoc UpgradeDownload' | 'Fastboot' | 'Android Kernel';
  meaning: string;
  hardwareOrSoftware: 'software_fixable' | 'hardware_component' | 'nand_bad_sectors' | 'baseband_ic' | 'usb_cable';
  rootCause: string;
  universalFixPlan: string;
  actionCommands: string[];
}

export interface NetworkOperatorProfile {
  id: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  operatorName: string;
  mccMnc: string;
  apnName: string;
  apnType: string;
  volteSupport: boolean;
  vonr5gSupport: boolean;
  imsApn?: string;
  bandFrequencies: string[];
  carrierConfigPayload?: string;
}

export interface ArabizationStep {
  stepNumber: number;
  instruction: string;
  command?: string;
  explanation?: string;
}

export interface ArabizationMethod {
  title: string;
  type: string;
  requiresRoot: boolean;
  successRate: number;
  estimatedTime: string;
  steps: ArabizationStep[];
  requiredPermissions?: string[];
}

export interface CscModification {
  fileName: string;
  featureKey: string;
  value: string;
  description: string;
}

export interface DiagnosisResult {
  deviceSummary: string;
  arabizationDifficulty: string;
  bestMethod: string;
  methods: ArabizationMethod[];
  adbScriptCommands: string[];
  cscModifications?: CscModification[];
  fontRecommendations: string[];
  warnings: string[];
  rollbackPlan: string[];
}

export interface StringTranslationItem {
  key: string;
  original: string;
  arabic: string;
  isFormatted?: boolean;
  notes?: string;
}

export interface TranslationResult {
  translatedXml: string;
  items: StringTranslationItem[];
  translationSummary: {
    totalCount: number;
    formattedVariablesPreserved?: number;
    rtlCompatibilityNotes?: string;
  };
}

export interface CscPatchResult {
  cscXmlContent: string;
  featuresList: {
    tag: string;
    value: string;
    description: string;
    benefit?: string;
  }[];
  injectionMethod: string;
  targetPathOnDevice: string;
  installationCommands: string[];
}

export interface MagiskModuleResult {
  moduleProp: string;
  systemProp: string;
  customizeSh: string;
  fontsXmlOverride: string;
  readmeMd: string;
  structureExplanation: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
}

export interface TerminalLog {
  id: string;
  text: string;
  type: 'cmd' | 'output' | 'error' | 'success' | 'info';
  timestamp: string;
}

export interface AdbCommandPreset {
  id: string;
  category: 'arabization' | 'permissions' | 'diagnosis' | 'system' | 'reboot' | 'fonts' | 'csc';
  title: string;
  command: string;
  description: string;
  requiresRoot: boolean;
  dangerLevel: 'safe' | 'medium' | 'high';
}

export interface LearnedRepairCase {
  id: string;
  problemTitle: string;
  category: string;
  symptoms: string;
  errorLogSnippet?: string;
  targetDeviceBrand: string;
  targetDeviceModel?: string;
  rootCauseAnalysis: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  resolvedFixCommands: string[];
  preventiveMeasures: string[];
  successCount: number;
  failureRollbackCount: number;
  learnedAt: string;
  confidenceScore: number;
  verifiedByAi: boolean;
}

export type FamousBoxBrand =
  | 'unlock_tool'
  | 'chimera_tool'
  | 'z3x_samsung_pro'
  | 'pandora_mtk_box'
  | 'umt_qcfire'
  | 'octoplus_pro'
  | 'eft_pro_dongle'
  | 'easyjtag_medusa_ufs'
  | 'hydra_dongle'
  | 'miracle_thunder';

export interface BoxEngineTool {
  id: string;
  title: string;
  boxOrigin: FamousBoxBrand;
  category: 'frp_security' | 'imei_cert' | 'partition_manager' | 'bootloader_auth' | 'flasher_scatter' | 'unbrick_edl' | 'arabic_patch';
  chipsetTarget: string;
  requiredMode: DeviceBootMode;
  description: string;
  rawProtocolCommand: string;
  dangerRating: 'safe' | 'medium' | 'high' | 'expert';
  successRate: number;
  estimatedSeconds: number;
}

export interface BoxEngineProfile {
  id: FamousBoxBrand;
  name: string;
  arabicName: string;
  logoIcon: string;
  specialty: string;
  colorTheme: string;
  supportedArchitectures: string[];
  keyProtocols: string[];
  toolsCount: number;
}

export interface TwoClickDiagnosisResult {
  detectedFaultsCount: number;
  healthScoreBefore: number;
  healthScoreAfter: number;
  faultsSummary: {
    faultName: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    affectedModule: string;
    technicalReason: string;
  }[];
  recommendedBoxEngine: string;
  targetExecutionMode: string;
  autoFixSteps: {
    stepIndex: number;
    title: string;
    boxProtocolAction: string;
    commandOrPayload: string;
    targetPartition?: string;
    explanation: string;
    durationMs?: number;
  }[];
  safetyNotes: string;
  finalVerificationCheck: string;
}

export interface SecurityExploitBypass {
  id: string;
  title: string;
  category: 'frp' | 'knox_kg' | 'icloud_ramdisk' | 'brom_auth' | 'edl_auth' | 'mi_account' | 'mdm_payjoy' | 'baseband_imei' | 'bootloader_unlock';
  targetBrand: string;
  targetChipset: string;
  supportedSecurityPatches: string;
  exploitType: 'Hardware USB BootROM' | 'Kernel Exploit' | 'TestPoint ISP' | 'CSC / Secret Code' | 'Fastboot Protocol' | 'Ramdisk SSH';
  cveOrIdentifier: string;
  description: string;
  successRate: number;
  executionSteps: string[];
  protocolCommand: string;
  requiredMode: DeviceBootMode;
  dateDiscovered: string;
  isZeroDay: boolean;
}

export interface HourlySyncReport {
  syncTimestamp: string;
  newVersionTag: string;
  newExploitsCount: number;
  newTestPointsMapped: number;
  latestDiscoveredExploits: {
    title: string;
    targetBrandAndChipset: string;
    cveOrVulnId: string;
    severityScore: number;
    exploitMechanism: string;
    bypassMethod: string;
    executableCommand: string;
  }[];
  algorithmOptimizations: string[];
  systemHealthStatus: string;
  nextScheduledSyncMinutes: number;
}

export interface UniversalKnownFault {
  id: string;
  title: string;
  osScope: 'All Systems' | 'Android' | 'iOS' | 'HarmonyOS' | 'KaiOS';
  category: 'bootloop' | 'baseband_network' | 'frp_security' | 'display_touch' | 'memory_ufs' | 'anti_rollback' | 'battery_pmic';
  affectedBrands: string[];
  symptoms: string;
  rootCause: string;
  hardwareOrSoftware: 'software_only' | 'testpoint_edl' | 'isp_ufs' | 'component_safe';
  directProtocolSolution: string[];
  recommendedTool: string;
  successRate: number;
  dangerLevel: 'Safe' | 'Moderate' | 'Expert';
}

export interface AnyFaultAiSolution {
  faultClassification: string;
  rootCauseAnalysis: string;
  isFixableWithoutDataLoss: boolean;
  estimatedSuccessRate: number;
  requiredConnectionMode: string;
  stepByStepProtocol: {
    stepNumber: number;
    title: string;
    actionDescription: string;
    directCommandOrPayload: string;
    partitionInvolved?: string;
  }[];
  preventionAndCareAdvice: string;
}

export interface UniversalDriverInfo {
  id: string;
  name: string;
  category: 'qualcomm' | 'mediatek' | 'samsung' | 'apple' | 'huawei' | 'unisoc' | 'google_adb' | 'xiaomi' | 'libusb' | 'motorola' | 'generic';
  supportedModes: string[];
  version: string;
  fileSize: string;
  status: 'installed' | 'missing' | 'outdated' | 'conflict';
  infFileName: string;
  hardwareId: string;
  description: string;
  installCommandWindows: string;
  installCommandLinux: string;
  installCommandMac: string;
  troubleshootGuide: string;
  isSignedWhql: boolean;
}

export interface SynthesizedToolSolution {
  synthesizedToolName: string;
  synthesizedArchitecture: string;
  bypassLogicExplanation: string;
  estimatedFixRate: number;
  binaryOrPayloadFormat: string;
  generatedScriptContent: string;
  executableTerminalCommands: string[];
  directExecutionProtocol: {
    stepNumber: number;
    instruction: string;
    command: string;
  }[];
}

export interface StorageHealthStatus {
  type: string;
  wearLevel: string;
  isReadOnlyLocked: boolean;
  diagnosticSummary: string;
  repairAction: string;
}

export interface ScreenLockStatus {
  hasLock: boolean;
  lockType: string;
  zeroDataLossSupported: boolean;
  preservedDataItems: string[];
  methodName: string;
  directUnlockCommand: string;
}

export interface NetworkAndCloudLocks {
  simLockCarrier: string;
  isSimLocked: boolean;
  carrierUnlockMethod: string;
  iCloudStatus: string;
  iCloudBypassPossibleWithSignal: boolean;
  cloudUnlockProtocol: string;
}

export interface DetectedFaultItem {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: 'storage' | 'network' | 'security_lock' | 'kernel_system' | 'hardware_ic';
  rootCause: string;
  resolutionGuide: string;
  oneClickFixAvailable: boolean;
  fixCommands: string[];
}

export interface RepairPlanStep {
  step: number;
  title: string;
  action: string;
  terminalCommand: string;
  dataSafety: string;
}

export interface DetectedFaultItem {
  component: string;
  status: 'passed' | 'warning' | 'failed';
  details: string;
}

export interface DeepDiagnosticAndUnlockReport {
  overallHealthScore: number;
  detectedFaults: DetectedFaultItem[];
  recommendedRepairPlan: RepairPlanStep[];
  storageHealthStatus: any;
  screenLockStatus: any;
  networkAndCloudLocks: any;
}

export interface RepairOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  deviceInfo: {
    brand: string;
    model: string;
    serialNumber: string;
    imei?: string;
  };
  faultDescription: string;
  status: 'pending' | 'diagnosing' | 'repairing' | 'ready' | 'delivered' | 'cancelled';
  technicianId: string;
  createdAt: string;
  updatedAt: string;
  cost: number;
  partsUsed: {
    name: string;
    price: number;
  }[];
  notes: string;
  imagesBefore: string[];
  imagesAfter: string[];
}

export interface HardwareMeasurement {
  id: string;
  type: 'voltage' | 'current' | 'resistance' | 'frequency' | 'thermal';
  pointName: string;
  value: string;
  unit: string;
  timestamp: string;
  isManual: boolean;
  notes?: string;
}

export interface AiRepairExpert {
  diagnosis: string;
  confidence: number; // 0 to 1
  rootCauses: string[];
  evidence: string[];
  nextSteps: string[];
  risks: string[];
  willWipeData: boolean;
  repairPlan: RepairPlanStep[];
}

export type OmniFixAgentId = 'silicon' | 'rf_baseband' | 'electronics' | 'security_integrity';

export interface OmniFixAgent {
  id: OmniFixAgentId;
  name: string;
  arabicName: string;
  status: 'idle' | 'analyzing' | 'active' | 'warning' | 'error';
  specialization: string;
  activeTask?: string;
  telemetryData?: Record<string, string | number>;
}

export interface ConsentRequirement {
  id: string;
  actionTitle: string;
  description: string;
  riskLevel: 'safe' | 'low' | 'moderate' | 'high' | 'critical';
  successProbability: number;
  dataSafety: 'no_loss' | 'possible_loss' | 'wipe_mandatory';
  steps: string[];
  requiredPermissions: string[];
  autoBackupDone: boolean;
}

export interface HardwareTelemetry {
  voltage: number;
  current: number;
  temperature: number;
  bootMode: DeviceBootMode;
  usbStatus: 'connected' | 'disconnected' | 'handshaking' | 'protocol_error';
  registers?: Record<string, string>;
}

export interface BoardComponent {
  id: string;
  name: string;
  function: string;
  x: number;
  y: number;
  z: number;
  status: 'normal' | 'faulty' | 'shorted' | 'open_circuit';
  readings: HardwareMeasurement[];
}

export type SocialPlatform = 'facebook' | 'instagram' | 'twitter' | 'tiktok' | 'youtube' | 'linkedin' | 'threads';

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  username: string;
  avatarUrl?: string;
  status: 'connected' | 'expired' | 'reconnecting';
  followersCount: number;
  lastSyncAt: string;
}

export interface SocialPost {
  id: string;
  accountId: string;
  platform: SocialPlatform;
  content: string;
  mediaUrls: string[];
  hashtags: string[];
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt: string;
  publishedAt?: string;
  engagement?: {
    likes: number;
    shares: number;
    comments: number;
    views: number;
  };
  aiGenerated: boolean;
  aiPrompt?: string;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  objective: 'awareness' | 'engagement' | 'leads' | 'sales';
  budget?: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'paused' | 'completed';
  postsCount: number;
  totalEngagement: number;
}

export interface AnalyticsDataPoint {
  date: string;
  views: number;
  engagement: number;
  conversions: number;
}

