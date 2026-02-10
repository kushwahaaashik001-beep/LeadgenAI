/// <reference types="next" />
/// <reference types="next/image-types/global" />
/// <reference types="next/navigation-types/compat/navigation" />

// NOTE: This file should not be edited
// See https://nextjs.org/docs/app/building-your-application/configuring/typescript for more information.

// Environment Variables Type Definitions
declare namespace NodeJS {
  interface ProcessEnv {
    // Next.js
    NODE_ENV: 'development' | 'production' | 'test'
    NEXT_PUBLIC_APP_URL: string
    NEXT_PUBLIC_VERCEL_URL?: string
    
    // Supabase
    NEXT_PUBLIC_SUPABASE_URL: string
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string
    SUPABASE_SERVICE_ROLE_KEY: string
    
    // Groq AI
    GROQ_API_KEY: string
    
    // Payment Gateway
    RAZORPAY_KEY_ID: string
    RAZORPAY_KEY_SECRET: string
    
    // Analytics
    NEXT_PUBLIC_GA_ID: string
    NEXT_PUBLIC_SENTRY_DSN: string
    
    // Email Service
    RESEND_API_KEY: string
    SMTP_HOST: string
    SMTP_PORT: string
    SMTP_USER: string
    SMTP_PASS: string
    
    // Security
    JWT_SECRET: string
    ENCRYPTION_KEY: string
    
    // External APIs
    GOOGLE_PLACES_API_KEY: string
    LINKEDIN_API_KEY: string
  }
}

// Global Type Augmentations
declare global {
  // Add custom window properties
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
    Razorpay: any
    // PWA install prompt
    beforeinstallprompt: any
  }
  
  // Service Worker Registration
  interface Navigator {
    serviceWorker: ServiceWorkerContainer
  }
  
  // Web Share API
  interface Navigator {
    share?: (data?: ShareData) => Promise<void>
  }
  
  // Speech Synthesis
  interface Window {
    SpeechSynthesisUtterance: typeof SpeechSynthesisUtterance
    speechSynthesis: SpeechSynthesis
  }
  
  interface ShareData {
    title?: string
    text?: string
    url?: string
    files?: File[]
  }
}

// Module Declarations
declare module 'groq-sdk' {
  export default class Groq {
    constructor(config: { apiKey: string })
    chat: {
      completions: {
        create: (params: any) => Promise<any>
      }
    }
  }
}

declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  export const Search: FC<SVGProps<SVGSVGElement>>
  export const Bell: FC<SVGProps<SVGSVGElement>>
  export const User: FC<SVGProps<SVGSVGElement>>
  export const Home: FC<SVGProps<SVGSVGElement>>
  export const Settings: FC<SVGProps<SVGSVGElement>>
  export const LogOut: FC<SVGProps<SVGSVGElement>>
  export const ChevronDown: FC<SVGProps<SVGSVGElement>>
  export const Menu: FC<SVGProps<SVGSVGElement>>
  export const X: FC<SVGProps<SVGSVGElement>>
  export const AlertCircle: FC<SVGProps<SVGSVGElement>>
  export const CheckCircle: FC<SVGProps<SVGSVGElement>>
  export const Info: FC<SVGProps<SVGSVGElement>>
  export const Star: FC<SVGProps<SVGSVGElement>>
  export const Heart: FC<SVGProps<SVGSVGElement>>
  export const Share2: FC<SVGProps<SVGSVGElement>>
  export const Download: FC<SVGProps<SVGSVGElement>>
  export const Upload: FC<SVGProps<SVGSVGElement>>
  export const Eye: FC<SVGProps<SVGSVGElement>>
  export const EyeOff: FC<SVGProps<SVGSVGElement>>
  export const Lock: FC<SVGProps<SVGSVGElement>>
  export const Unlock: FC<SVGProps<SVGSVGElement>>
  export const Mail: FC<SVGProps<SVGSVGElement>>
  export const Phone: FC<SVGProps<SVGSVGElement>>
  export const MapPin: FC<SVGProps<SVGSVGElement>>
  export const Globe: FC<SVGProps<SVGSVGElement>>
  export const Calendar: FC<SVGProps<SVGSVGElement>>
  export const Clock: FC<SVGProps<SVGSVGElement>>
  export const CreditCard: FC<SVGProps<SVGSVGElement>>
  export const DollarSign: FC<SVGProps<SVGSVGElement>>
  export const TrendingUp: FC<SVGProps<SVGSVGElement>>
  export const TrendingDown: FC<SVGProps<SVGSVGElement>>
  export const BarChart3: FC<SVGProps<SVGSVGElement>>
  export const PieChart: FC<SVGProps<SVGSVGElement>>
  export const LineChart: FC<SVGProps<SVGSVGElement>>
  export const Filter: FC<SVGProps<SVGSVGElement>>
  export const SortAsc: FC<SVGProps<SVGSVGElement>>
  export const SortDesc: FC<SVGProps<SVGSVGElement>>
  export const Plus: FC<SVGProps<SVGSVGElement>>
  export const Minus: FC<SVGProps<SVGSVGElement>>
  export const Edit: FC<SVGProps<SVGSVGElement>>
  export const Trash2: FC<SVGProps<SVGSVGElement>>
  export const Copy: FC<SVGProps<SVGSVGElement>>
  export const ExternalLink: FC<SVGProps<SVGSVGElement>>
  export const Link: FC<SVGProps<SVGSVGElement>>
  export const Bookmark: FC<SVGProps<SVGSVGElement>>
  export const Tag: FC<SVGProps<SVGSVGElement>>
  export const Hash: FC<SVGProps<SVGSVGElement>>
  export const AtSign: FC<SVGProps<SVGSVGElement>>
  export const MessageCircle: FC<SVGProps<SVGSVGElement>>
  export const MessageSquare: FC<SVGProps<SVGSVGElement>>
  export const Send: FC<SVGProps<SVGSVGElement>>
  export const ThumbsUp: FC<SVGProps<SVGSVGElement>>
  export const ThumbsDown: FC<SVGProps<SVGSVGElement>>
  export const Smile: FC<SVGProps<SVGSVGElement>>
  export const Frown: FC<SVGProps<SVGSVGElement>>
  export const Meh: FC<SVGProps<SVGSVGElement>>
  export const Award: FC<SVGProps<SVGSVGElement>>
  export const Trophy: FC<SVGProps<SVGSVGElement>>
  export const Gift: FC<SVGProps<SVGSVGElement>>
  export const Sparkles: FC<SVGProps<SVGSVGElement>>
  export const Zap: FC<SVGProps<SVGSVGElement>>
  export const Target: FC<SVGProps<SVGSVGElement>>
  export const Briefcase: FC<SVGProps<SVGSVGElement>>
  export const Building: FC<SVGProps<SVGSVGElement>>
  export const Users: FC<SVGProps<SVGSVGElement>>
  export const UserPlus: FC<SVGProps<SVGSVGElement>>
  export const UserCheck: FC<SVGProps<SVGSVGElement>>
  export const UserX: FC<SVGProps<SVGSVGElement>>
  export const Shield: FC<SVGProps<SVGSVGElement>>
  export const ShieldCheck: FC<SVGProps<SVGSVGElement>>
  export const ShieldOff: FC<SVGProps<SVGSVGElement>>
  export const Key: FC<SVGProps<SVGSVGElement>>
  export const Database: FC<SVGProps<SVGSVGElement>>
  export const Server: FC<SVGProps<SVGSVGElement>>
  export const Cloud: FC<SVGProps<SVGSVGElement>>
  export const Wifi: FC<SVGProps<SVGSVGElement>>
  export const WifiOff: FC<SVGProps<SVGSVGElement>>
  export const Cpu: FC<SVGProps<SVGSVGElement>>
  export const HardDrive: FC<SVGProps<SVGSVGElement>>
  export const Smartphone: FC<SVGProps<SVGSVGElement>>
  export const Monitor: FC<SVGProps<SVGSVGElement>>
  export const Tablet: FC<SVGProps<SVGSVGElement>>
  export const Camera: FC<SVGProps<SVGSVGElement>>
  export const Video: FC<SVGProps<SVGSVGElement>>
  export const Music: FC<SVGProps<SVGSVGElement>>
  export const Headphones: FC<SVGProps<SVGSVGElement>>
  export const Mic: FC<SVGProps<SVGSVGElement>>
  export const MicOff: FC<SVGProps<SVGSVGElement>>
  export const Volume2: FC<SVGProps<SVGSVGElement>>
  export const VolumeX: FC<SVGProps<SVGSVGElement>>
  export const Play: FC<SVGProps<SVGSVGElement>>
  export const Pause: FC<SVGProps<SVGSVGElement>>
  export const StopCircle: FC<SVGProps<SVGSVGElement>>
  export const SkipBack: FC<SVGProps<SVGSVGElement>>
  export const SkipForward: FC<SVGProps<SVGSVGElement>>
  export const Rewind: FC<SVGProps<SVGSVGElement>>
  export const FastForward: FC<SVGProps<SVGSVGElement>>
  export const RefreshCw: FC<SVGProps<SVGSVGElement>>
  export const RotateCw: FC<SVGProps<SVGSVGElement>>
  export const RotateCcw: FC<SVGProps<SVGSVGElement>>
  export const Loader: FC<SVGProps<SVGSVGElement>>
  export const MoreHorizontal: FC<SVGProps<SVGSVGElement>>
  export const MoreVertical: FC<SVGProps<SVGSVGElement>>
  export const ChevronRight: FC<SVGProps<SVGSVGElement>>
  export const ChevronLeft: FC<SVGProps<SVGSVGElement>>
  export const ChevronUp: FC<SVGProps<SVGSVGElement>>
  export const ArrowRight: FC<SVGProps<SVGSVGElement>>
  export const ArrowLeft: FC<SVGProps<SVGSVGElement>>
  export const ArrowUp: FC<SVGProps<SVGSVGElement>>
  export const ArrowDown: FC<SVGProps<SVGSVGElement>>
  export const CornerUpLeft: FC<SVGProps<SVGSVGElement>>
  export const CornerUpRight: FC<SVGProps<SVGSVGElement>>
  export const CornerDownLeft: FC<SVGProps<SVGSVGElement>>
  export const CornerDownRight: FC<SVGProps<SVGSVGElement>>
  export const Move: FC<SVGProps<SVGSVGElement>>
  export const Maximize2: FC<SVGProps<SVGSVGElement>>
  export const Minimize2: FC<SVGProps<SVGSVGElement>>
  export const XCircle: FC<SVGProps<SVGSVGElement>>
  export const Check: FC<SVGProps<SVGSVGElement>>
  export const HelpCircle: FC<SVGProps<SVGSVGElement>>
  export const Code: FC<SVGProps<SVGSVGElement>>
  export const Terminal: FC<SVGProps<SVGSVGElement>>
  export const GitBranch: FC<SVGProps<SVGSVGElement>>
  export const GitPullRequest: FC<SVGProps<SVGSVGElement>>
  export const GitCommit: FC<SVGProps<SVGSVGElement>>
  export const GitMerge: FC<SVGProps<SVGSVGElement>>
  export const Layers: FC<SVGProps<SVGSVGElement>>
  export const Layout: FC<SVGProps<SVGSVGElement>>
  export const Grid: FC<SVGProps<SVGSVGElement>>
  export const List: FC<SVGProps<SVGSVGElement>>
  export const Sidebar: FC<SVGProps<SVGSVGElement>>
  export const Sliders: FC<SVGProps<SVGSVGElement>>
  export const ToggleLeft: FC<SVGProps<SVGSVGElement>>
  export const ToggleRight: FC<SVGProps<SVGSVGElement>>
  export const Sun: FC<SVGProps<SVGSVGElement>>
  export const Moon: FC<SVGProps<SVGSVGElement>>
  export const Sunrise: FC<SVGProps<SVGSVGElement>>
  export const Sunset: FC<SVGProps<SVGSVGElement>>
  export const CloudRain: FC<SVGProps<SVGSVGElement>>
  export const CloudSnow: FC<SVGProps<SVGSVGElement>>
  export const CloudLightning: FC<SVGProps<SVGSVGElement>>
  export const Wind: FC<SVGProps<SVGSVGElement>>
  export const Droplet: FC<SVGProps<SVGSVGElement>>
  export const Thermometer: FC<SVGProps<SVGSVGElement>>
  export const Compass: FC<SVGProps<SVGSVGElement>>
  export const Navigation: FC<SVGProps<SVGSVGElement>>
  export const Map: FC<SVGProps<SVGSVGElement>>
  export const Flag: FC<SVGProps<SVGSVGElement>>
  export const Anchor: FC<SVGProps<SVGSVGElement>>
  export const Coffee: FC<SVGProps<SVGSVGElement>>
  export const ShoppingCart: FC<SVGProps<SVGSVGElement>>
  export const Package: FC<SVGProps<SVGSVGElement>>
  export const Truck: FC<SVGProps<SVGSVGElement>>
  export const Box: FC<SVGProps<SVGSVGElement>>
  export const Home: FC<SVGProps<SVGSVGElement>>
  export const Book: FC<SVGProps<SVGSVGElement>>
  export const BookOpen: FC<SVGProps<SVGSVGElement>>
  export const FileText: FC<SVGProps<SVGSVGElement>>
  export const File: FC<SVGProps<SVGSVGElement>>
  export const Folder: FC<SVGProps<SVGSVGElement>>
  export const FolderPlus: FC<SVGProps<SVGSVGElement>>
  export const Paperclip: FC<SVGProps<SVGSVGElement>>
  export const Clipboard: FC<SVGProps<SVGSVGElement>>
  export const ClipboardCheck: FC<SVGProps<SVGSVGElement>>
  export const ClipboardCopy: FC<SVGProps<SVGSVGElement>>
  export const ClipboardList: FC<SVGProps<SVGSVGElement>>
  export const CheckSquare: FC<SVGProps<SVGSVGElement>>
  export const Square: FC<SVGProps<SVGSVGElement>>
  export const Circle: FC<SVGProps<SVGSVGElement>>
  export const Hexagon: FC<SVGProps<SVGSVGElement>>
  export const Octagon: FC<SVGProps<SVGSVGElement>>
  export const Triangle: FC<SVGProps<SVGSVGElement>>
  export const Activity: FC<SVGProps<SVGSVGElement>>
  export const Airplay: FC<SVGProps<SVGSVGElement>>
  export const AlertTriangle: FC<SVGProps<SVGSVGElement>>
  export const AlignCenter: FC<SVGProps<SVGSVGElement>>
  export const AlignJustify: FC<SVGProps<SVGSVGElement>>
  export const AlignLeft: FC<SVGProps<SVGSVGElement>>
  export const AlignRight: FC<SVGProps<SVGSVGElement>>
  export const Archive: FC<SVGProps<SVGSVGElement>>
  export const ArrowUpCircle: FC<SVGProps<SVGSVGElement>>
  export const ArrowDownCircle: FC<SVGProps<SVGSVGElement>>
  export const ArrowLeftCircle: FC<SVGProps<SVGSVGElement>>
  export const ArrowRightCircle: FC<SVGProps<SVGSVGElement>>
  export const Aperture: FC<SVGProps<SVGSVGElement>>
  export const Battery: FC<SVGProps<SVGSVGElement>>
  export const BatteryCharging: FC<SVGProps<SVGSVGElement>>
  export const BellOff: FC<SVGProps<SVGSVGElement>>
  export const Bluetooth: FC<SVGProps<SVGSVGElement>>
  export const Bold: FC<SVGProps<SVGSVGElement>>
  export const BookmarkPlus: FC<SVGProps<SVGSVGElement>>
  export const CalendarDays: FC<SVGProps<SVGSVGElement>>
  export const CameraOff: FC<SVGProps<SVGSVGElement>>
  export const Cast: FC<SVGProps<SVGSVGElement>>
  export const CheckCircle2: FC<SVGProps<SVGSVGElement>>
  export const ChevronsDown: FC<SVGProps<SVGSVGElement>>
  export const ChevronsLeft: FC<SVGProps<SVGSVGElement>>
  export const ChevronsRight: FC<SVGProps<SVGSVGElement>>
  export const ChevronsUp: FC<SVGProps<SVGSVGElement>>
  export const Chrome: FC<SVGProps<SVGSVGElement>>
  export const CircleDot: FC<SVGProps<SVGSVGElement>>
  export const CircleEllipsis: FC<SVGProps<SVGSVGElement>>
  export const CircleSlashed: FC<SVGProps<SVGSVGElement>>
  export const CloudDrizzle: FC<SVGProps<SVGSVGElement>>
  export const CloudFog: FC<SVGProps<SVGSVGElement>>
  export const CloudHail: FC<SVGProps<SVGSVGElement>>
  export const CloudMoon: FC<SVGProps<SVGSVGElement>>
  export const CloudSun: FC<SVGProps<SVGSVGElement>>
  export const Cloudy: FC<SVGProps<SVGSVGElement>>
  export const Clover: FC<SVGProps<SVGSVGElement>>
  export const Code2: FC<SVGProps<SVGSVGElement>>
  export const Codepen: FC<SVGProps<SVGSVGElement>>
  export const Codesandbox: FC<SVGProps<SVGSVGElement>>
  export const Columns: FC<SVGProps<SVGSVGElement>>
  export const Command: FC<SVGProps<SVGSVGElement>>
  export const Contact: FC<SVGProps<SVGSVGElement>>
  export const Contrast: FC<SVGProps<SVGSVGElement>>
  export const Cookie: FC<SVGProps<SVGSVGElement>>
  export const CopyPlus: FC<SVGProps<SVGSVGElement>>
  export const CornerLeftDown: FC<SVGProps<SVGSVGElement>>
  export const CornerLeftUp: FC<SVGProps<SVGSVGElement>>
  export const CornerRightDown: FC<SVGProps<SVGSVGElement>>
  export const CornerRightUp: FC<SVGProps<SVGSVGElement>>
  export const Cpu: FC<SVGProps<SVGSVGElement>>
  export const CreativeCommons: FC<SVGProps<SVGSVGElement>>
  export const Crop: FC<SVGProps<SVGSVGElement>>
  export const Crosshair: FC<SVGProps<SVGSVGElement>>
  export const Crown: FC<SVGProps<SVGSVGElement>>
  export const Cube: FC<SVGProps<SVGSVGElement>>
  export const Currency: FC<SVGProps<SVGSVGElement>>
  export const Diamond: FC<SVGProps<SVGSVGElement>>
  export const Dice1: FC<SVGProps<SVGSVGElement>>
  export const Dice2: FC<SVGProps<SVGSVGElement>>
  export const Dice3: FC<SVGProps<SVGSVGElement>>
  export const Dice4: FC<SVGProps<SVGSVGElement>>
  export const Dice5: FC<SVGProps<SVGSVGElement>>
  export const Dice6: FC<SVGProps<SVGSVGElement>>
  export const Disc: FC<SVGProps<SVGSVGElement>>
  export const Divide: FC<SVGProps<SVGSVGElement>>
  export const DivideCircle: FC<SVGProps<SVGSVGElement>>
  export const DivideSquare: FC<SVGProps<SVGSVGElement>>
  export const Dribbble: FC<SVGProps<SVGSVGElement>>
  export const Droplets: FC<SVGProps<SVGSVGElement>>
  export const Ear: FC<SVGProps<SVGSVGElement>>
  export const EarOff: FC<SVGProps<SVGSVGElement>>
  export const Edit2: FC<SVGProps<SVGSVGElement>>
  export const Edit3: FC<SVGProps<SVGSVGElement>>
  export const Equal: FC<SVGProps<SVGSVGElement>>
  export const EqualNot: FC<SVGProps<SVGSVGElement>>
  export const EyeDropper: FC<SVGProps<SVGSVGElement>>
  export const Facebook: FC<SVGProps<SVGSVGElement>>
  export const Figma: FC<SVGProps<SVGSVGElement>>
  export const FileArchive: FC<SVGProps<SVGSVGElement>>
  export const FileAudio: FC<SVGProps<SVGSVGElement>>
  export const FileCode: FC<SVGProps<SVGSVGElement>>
  export const FileImage: FC<SVGProps<SVGSVGElement>>
  export const FileVideo: FC<SVGProps<SVGSVGElement>>
  export const Film: FC<SVGProps<SVGSVGElement>>
  export const FilterX: FC<SVGProps<SVGSVGElement>>
  export const Fingerprint: FC<SVGProps<SVGSVGElement>>
  export const Fish: FC<SVGProps<SVGSVGElement>>
  export const FlagTriangleLeft: FC<SVGProps<SVGSVGElement>>
  export const FlagTriangleRight: FC<SVGProps<SVGSVGElement>>
  export const Flame: FC<SVGProps<SVGSVGElement>>
  export const Flashlight: FC<SVGProps<SVGSVGElement>>
  export const FlashlightOff: FC<SVGProps<SVGSVGElement>>
  export const FlaskConical: FC<SVGProps<SVGSVGElement>>
  export const FlaskRound: FC<SVGProps<SVGSVGElement>>
  export const FlipHorizontal: FC<SVGProps<SVGSVGElement>>
  export const FlipVertical: FC<SVGProps<SVGSVGElement>>
  export const Flower: FC<SVGProps<SVGSVGElement>>
  export const Flower2: FC<SVGProps<SVGSVGElement>>
  export const Focus: FC<SVGProps<SVGSVGElement>>
  export const FoldHorizontal: FC<SVGProps<SVGSVGElement>>
  export const FoldVertical: FC<SVGProps<SVGSVGElement>>
  export const FolderMinus: FC<SVGProps<SVGSVGElement>>
  export const FormInput: FC<SVGProps<SVGSVGElement>>
  export const Forward: FC<SVGProps<SVGSVGElement>>
  export const Frame: FC<SVGProps<SVGSVGElement>>
  export const Framer: FC<SVGProps<SVGSVGElement>>
  export const Function: FC<SVGProps<SVGSVGElement>>
  export const Gamepad: FC<SVGProps<SVGSVGElement>>
  export const Gamepad2: FC<SVGProps<SVGSVGElement>>
  export const Gauge: FC<SVGProps<SVGSVGElement>>
  export const Gavel: FC<SVGProps<SVGSVGElement>>
  export const Gem: FC<SVGProps<SVGSVGElement>>
  export const Ghost: FC<SVGProps<SVGSVGElement>>
  export const Gift: FC<SVGProps<SVGSVGElement>>
  export const GitCompare: FC<SVGProps<SVGSVGElement>>
  export const GitFork: FC<SVGProps<SVGSVGElement>>
  export const Gitlab: FC<SVGProps<SVGSVGElement>>
  export const GlassWater: FC<SVGProps<SVGSVGElement>>
  export const Glasses: FC<SVGProps<SVGSVGElement>>
  export const Grab: FC<SVGProps<SVGSVGElement>>
  export const GraduationCap: FC<SVGProps<SVGSVGElement>>
  export const Grid3x3: FC<SVGProps<SVGSVGElement>>
  export const GripHorizontal: FC<SVGProps<SVGSVGElement>>
  export const GripVertical: FC<SVGProps<SVGSVGElement>>
  export const Hammer: FC<SVGProps<SVGSVGElement>>
  export const Hand: FC<SVGProps<SVGSVGElement>>
  export const HandMetal: FC<SVGProps<SVGSVGElement>>
  export const HardHat: FC<SVGProps<SVGSVGElement>>
  export const Hash: FC<SVGProps<SVGSVGElement>>
  export const Haze: FC<SVGProps<SVGSVGElement>>
  export const HdmiPort: FC<SVGProps<SVGSVGElement>>
  export const Heading: FC<SVGProps<SVGSVGElement>>
  export const Heading1: FC<SVGProps<SVGSVGElement>>
  export const Heading2: FC<SVGProps<SVGSVGElement>>
  export const Heading3: FC<SVGProps<SVGSVGElement>>
  export const Heading4: FC<SVGProps<SVGSVGElement>>
  export const Heading5: FC<SVGProps<SVGSVGElement>>
  export const Heading6: FC<SVGProps<SVGSVGElement>>
  export const Headset: FC<SVGProps<SVGSVGElement>>
  export const HeartCrack: FC<SVGProps<SVGSVGElement>>
  export const HeartHandshake: FC<SVGProps<SVGSVGElement>>
  export const HeartOff: FC<SVGProps<SVGSVGElement>>
  export const HeartPulse: FC<SVGProps<SVGSVGElement>>
  export const HelpCircle: FC<SVGProps<SVGSVGElement>>
  export const Highlighter: FC<SVGProps<SVGSVGElement>>
  export const History: FC<SVGProps<SVGSVGElement>>
  export const Home: FC<SVGProps<SVGSVGElement>>
  export const Hop: FC<SVGProps<SVGSVGElement>>
  export const HopOff: FC<SVGProps<SVGSVGElement>>
  export const Hotel: FC<SVGProps<SVGSVGElement>>
  export const Hourglass: FC<SVGProps<SVGSVGElement>>
  export const IceCream: FC<SVGProps<SVGSVGElement>>
  export const Image: FC<SVGProps<SVGSVGElement>>
  export const ImageOff: FC<SVGProps<SVGSVGElement>>
  export const Import: FC<SVGProps<SVGSVGElement>>
  export const Inbox: FC<SVGProps<SVGSVGElement>>
  export const Indent: FC<SVGProps<SVGSVGElement>>
  export const IndianRupee: FC<SVGProps<SVGSVGElement>>
  export const Infinity: FC<SVGProps<SVGSVGElement>>
  export const Info: FC<SVGProps<SVGSVGElement>>
  export const Instagram: FC<SVGProps<SVGSVGElement>>
  export const Italic: FC<SVGProps<SVGSVGElement>>
  export const IterationCcw: FC<SVGProps<SVGSVGElement>>
  export const IterationCw: FC<SVGProps<SVGSVGElement>>
  export const JapaneseYen: FC<SVGProps<SVGSVGElement>>
  export const Joystick: FC<SVGProps<SVGSVGElement>>
  export const Kanban: FC<SVGProps<SVGSVGElement>>
  export const KeyRound: FC<SVGProps<SVGSVGElement>>
  export const KeySquare: FC<SVGProps<SVGSVGElement>>
  export const Keyboard: FC<SVGProps<SVGSVGElement>>
  export const Lamp: FC<SVGProps<SVGSVGElement>>
  export const LampCeiling: FC<SVGProps<SVGSVGElement>>
  export const LampDesk: FC<SVGProps<SVGSVGElement>>
  export const LampFloor: FC<SVGProps<SVGSVGElement>>
  export const LampWallDown: FC<SVGProps<SVGSVGElement>>
  export const LampWallUp: FC<SVGProps<SVGSVGElement>>
  export const Landmark: FC<SVGProps<SVGSVGElement>>
  export const Languages: FC<SVGProps<SVGSVGElement>>
  export const Laptop: FC<SVGProps<SVGSVGElement>>
  export const Laptop2: FC<SVGProps<SVGSVGElement>>
  export const Lasso: FC<SVGProps<SVGSVGElement>>
  export const LassoSelect: FC<SVGProps<SVGSVGElement>>
  export const Laugh: FC<SVGProps<SVGSVGElement>>
  export const Layers2: FC<SVGProps<SVGSVGElement>>
  export const Layers3: FC<SVGProps<SVGSVGElement>>
  export const LayoutDashboard: FC<SVGProps<SVGSVGElement>>
  export const LayoutGrid: FC<SVGProps<SVGSVGElement>>
  export const LayoutList: FC<SVGProps<SVGSVGElement>>
  export const LayoutPanelLeft: FC<SVGProps<SVGSVGElement>>
  export const LayoutPanelTop: FC<SVGProps<SVGSVGElement>>
  export const LayoutTemplate: FC<SVGProps<SVGSVGElement>>
  export const Leaf: FC<SVGProps<SVGSVGElement>>
  export const LeafyGreen: FC<SVGProps<SVGSVGElement>>
  export const Library: FC<SVGProps<SVGSVGElement>>
  export const LifeBuoy: FC<SVGProps<SVGSVGElement>>
  export const Ligature: FC<SVGProps<SVGSVGElement>>
  export const Lightbulb: FC<SVGProps<SVGSVGElement>>
  export const LightbulbOff: FC<SVGProps<SVGSVGElement>>
  export const LineChart: FC<SVGProps<SVGSVGElement>>
  export const Link2: FC<SVGProps<SVGSVGElement>>
  export const Link2Off: FC<SVGProps<SVGSVGElement>>
  export const Linkedin: FC<SVGProps<SVGSVGElement>>
  export const ListChecks: FC<SVGProps<SVGSVGElement>>
  export const ListEnd: FC<SVGProps<SVGSVGElement>>
  export const ListFilter: FC<SVGProps<SVGSVGElement>>
  export const ListMinus: FC<SVGProps<SVGSVGElement>>
  export const ListMusic: FC<SVGProps<SVGSVGElement>>
  export const ListOrdered: FC<SVGProps<SVGSVGElement>>
  export const ListPlus: FC<SVGProps<SVGSVGElement>>
  export const ListRestart: FC<SVGProps<SVGSVGElement>>
  export const ListStart: FC<SVGProps<SVGSVGElement>>
  export const ListTodo: FC<SVGProps<SVGSVGElement>>
  export const ListTree: FC<SVGProps<SVGSVGElement>>
  export const ListVideo: FC<SVGProps<SVGSVGElement>>
  export const ListX: FC<SVGProps<SVGSVGElement>>
  export const Loader2: FC<SVGProps<SVGSVGElement>>
  export const Locate: FC<SVGProps<SVGSVGElement>>
  export const LocateFixed: FC<SVGProps<SVGSVGElement>>
  export const LocateOff: FC<SVGProps<SVGSVGElement>>
  export const LockKeyhole: FC<SVGProps<SVGSVGElement>>
  export const LogIn: FC<SVGProps<SVGSVGElement>>
  export const LogOut: FC<SVGProps<SVGSVGElement>>
  export const Mails: FC<SVGProps<SVGSVGElement>>
  export const MapPinned: FC<SVGProps<SVGSVGElement>>
  export const Maximize: FC<SVGProps<SVGSVGElement>>
  export const Medal: FC<SVGProps<SVGSVGElement>>
  export const Megaphone: FC<SVGProps<SVGSVGElement>>
  export const MegaphoneOff: FC<SVGProps<SVGSVGElement>>
  export const Meh: FC<SVGProps<SVGSVGElement>>
  export const MemoryStick: FC<SVGProps<SVGSVGElement>>
  export const MenuSquare: FC<SVGProps<SVGSVGElement>>
  export const Merge: FC<SVGProps<SVGSVGElement>>
  export const MessageCircle: FC<SVGProps<SVGSVGElement>>
  export const MessageCircleDashed: FC<SVGProps<SVGSVGElement>>
  export const MessageCircleHeart: FC<SVGProps<SVGSVGElement>>
  export const MessageCircleMore: FC<SVGProps<SVGSVGElement>>
  export const MessageCircleOff: FC<SVGProps<SVGSVGElement>>
  export const MessageCirclePlus: FC<SVGProps<SVGSVGElement>>
  export const MessageCircleQuestion: FC<SVGProps<SVGSVGElement>>
  export const MessageCircleReply: FC<SVGProps<SVGSVGElement>>
  export const MessageCircleWarning: FC<SVGProps<SVGSVGElement>>
  export const MessageCircleX: FC<SVGProps<SVGSVGElement>>
  export const MessageSquare: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareDashed: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareDiff: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareDot: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareHeart: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareMore: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareOff: FC<SVGProps<SVGSVGElement>>
  export const MessageSquarePlus: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareQuote: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareReply: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareShare: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareText: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareWarning: FC<SVGProps<SVGSVGElement>>
  export const MessageSquareX: FC<SVGProps<SVGSVGElement>>
  export const MessagesSquare: FC<SVGProps<SVGSVGElement>>
  export const Mic2: FC<SVGProps<SVGSVGElement>>
  export const MicOff: FC<SVGProps<SVGSVGElement>>
  export const Microscope: FC<SVGProps<SVGSVGElement>>
  export const Microwave: FC<SVGProps<SVGSVGElement>>
  export const Milestone: FC<SVGProps<SVGSVGElement>>
  export const Milk: FC<SVGProps<SVGSVGElement>>
  export const MilkOff: FC<SVGProps<SVGSVGElement>>
  export const Minimize: FC<SVGProps<SVGSVGElement>>
  export const MinusCircle: FC<SVGProps<SVGSVGElement>>
  export const MinusSquare: FC<SVGProps<SVGSVGElement>>
  export const MonitorCheck: FC<SVGProps<SVGSVGElement>>
  export const MonitorDot: FC<SVGProps<SVGSVGElement>>
  export const MonitorDown: FC<SVGProps<SVGSVGElement>>
  export const MonitorOff: FC<SVGProps<SVGSVGElement>>
  export const MonitorPause: FC<SVGProps<SVGSVGElement>>
  export const MonitorPlay: FC<SVGProps<SVGSVGElement>>
  export const MonitorSmartphone: FC<SVGProps<SVGSVGElement>>
  export const MonitorSpeaker: FC<SVGProps<SVGSVGElement>>
  export const MonitorStop: FC<SVGProps<SVGSVGElement>>
  export const MonitorUp: FC<SVGProps<SVGSVGElement>>
  export const MonitorX: FC<SVGProps<SVGSVGElement>>
  export const MoonStar: FC<SVGProps<SVGSVGElement>>
  export const Mountain: FC<SVGProps<SVGSVGElement>>
  export const MountainSnow: FC<SVGProps<SVGSVGElement>>
  export const Mouse: FC<SVGProps<SVGSVGElement>>
  export const MousePointer: FC<SVGProps<SVGSVGElement>>
  export const MousePointer2: FC<SVGProps<SVGSVGElement>>
  export const MousePointerClick: FC<SVGProps<SVGSVGElement>>
  export const MousePointerSquare: FC<SVGProps<SVGSVGElement>>
  export const Move3d: FC<SVGProps<SVGSVGElement>>
  export const MoveDiagonal: FC<SVGProps<SVGSVGElement>>
  export const MoveDiagonal2: FC<SVGProps<SVGSVGElement>>
  export const MoveHorizontal: FC<SVGProps<SVGSVGElement>>
  export const MoveVertical: FC<SVGProps<SVGSVGElement>>
  export const Music2: FC<SVGProps<SVGSVGElement>>
  export const Music3: FC<SVGProps<SVGSVGElement>>
  export const Music4: FC<SVGProps<SVGSVGElement>>
  export const Navigation2: FC<SVGProps<SVGSVGElement>>
  export const Navigation2Off: FC<SVGProps<SVGSVGElement>>
  export const Network: FC<SVGProps<SVGSVGElement>>
  export const Newspaper: FC<SVGProps<SVGSVGElement>>
  export const Nfc: FC<SVGProps<SVGSVGElement>>
  export const Notebook: FC<SVGProps<SVGSVGElement>>
  export const NotebookPen: FC<SVGProps<SVGSVGElement>>
  export const NotebookTabs
