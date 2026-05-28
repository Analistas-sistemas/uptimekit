import {
	IconAlarmClockOutline18,
	IconAlign3HorizontalOutline18,
	IconAlign3LeftOutline18,
	IconAlign3VerticalOutline18,
	IconArrowDoorOut3Outline18,
	IconArrowDottedRotateAnticlockwiseOutline18,
	IconAtSignOutline18,
	IconBellOutline18,
	IconBoxOutline18,
	IconBullhornOutline18,
	IconCalendarOutline18,
	IconChartBarTrendUpOutline18,
	IconCheckOutline18,
	IconChevronDownOutline18,
	IconChevronExpandYOutline18,
	IconChevronLeftOutline18,
	IconChevronRightOutline18,
	IconChevronUpOutline18,
	IconCircleHalfDottedCheckOutline18,
	IconCircleInfoOutline18,
	IconClipboardOutline18,
	IconComputerOutline18,
	IconCrosshairsOutline18,
	IconDarkLightOutline18,
	IconEarthOutline18,
	IconEnvelopeOutline18,
	IconEyeClosedOutline18,
	IconEyeOpenOutline18,
	IconFilterOutline18,
	IconFolderOutline18,
	IconGear2Outline18,
	IconGridCirclePlusOutline18,
	IconHalfDottedCirclePlayOutline18,
	IconHeartOutline18,
	IconImageOutline18,
	IconLightbulb3Outline18,
	IconLinkOutline18,
	IconLoaderOutline18,
	IconLockOutline18,
	IconMagnifierOutline18,
	IconMinusOutline18,
	IconMsgWritingOutline18,
	IconNodesOutline18,
	IconOfficeOutline18,
	IconPaperPlane2Outline18,
	IconPassword2Outline18,
	IconPen3Outline18,
	IconPlusOutline18,
	IconShieldCheckOutline18,
	IconSignal2Outline18,
	IconSitemap4Outline18,
	IconTextTool2Outline18,
	IconTrashOutline18,
	IconTriangleWarningOutline18,
	IconUnorderedListOutline18,
	IconUserOutline18,
	IconUserSearchOutline18,
	IconUsersOutline18,
	IconWindowChartLineOutline18,
	IconWindowExpandBottomRightOutline18,
	IconXmarkOutline18,
	type IconProps as NucleoIconProps,
} from "nucleo-ui-essential-outline-18";
import type { ComponentType } from "react";

export type IconProps = NucleoIconProps & {
	absoluteStrokeWidth?: boolean;
};

type IconComponent = ComponentType<IconProps>;

function createIcon(
	Icon: ComponentType<NucleoIconProps>,
	displayName: string,
): IconComponent {
	const NucleoIcon = ({
		absoluteStrokeWidth: _absoluteStrokeWidth,
		...props
	}: IconProps) => <Icon {...props} />;

	NucleoIcon.displayName = displayName;
	return NucleoIcon;
}

export const Activity = createIcon(IconSignal2Outline18, "Activity");
export const AlertCircle = createIcon(IconCircleInfoOutline18, "AlertCircle");
export const AlertOctagon = createIcon(
	IconTriangleWarningOutline18,
	"AlertOctagon",
);
export const AlertTriangle = createIcon(
	IconTriangleWarningOutline18,
	"AlertTriangle",
);
export const ArrowLeft = createIcon(IconChevronLeftOutline18, "ArrowLeft");
export const ArrowRight = createIcon(IconChevronRightOutline18, "ArrowRight");
export const AtSignIcon = createIcon(IconAtSignOutline18, "AtSignIcon");
export const Ban = createIcon(IconXmarkOutline18, "Ban");
export const BarChart = createIcon(IconChartBarTrendUpOutline18, "BarChart");
export const BarChart3 = createIcon(IconChartBarTrendUpOutline18, "BarChart3");
export const Bell = createIcon(IconBellOutline18, "Bell");
export const Braces = createIcon(IconTextTool2Outline18, "Braces");
export const Building2 = createIcon(IconOfficeOutline18, "Building2");
export const Calendar = createIcon(IconCalendarOutline18, "Calendar");
export const Check = createIcon(IconCheckOutline18, "Check");
export const CheckCircle = createIcon(
	IconCircleHalfDottedCheckOutline18,
	"CheckCircle",
);
export const CheckCircle2 = createIcon(
	IconCircleHalfDottedCheckOutline18,
	"CheckCircle2",
);
export const CheckIcon = Check;
export const ChevronDown = createIcon(IconChevronDownOutline18, "ChevronDown");
export const ChevronDownIcon = ChevronDown;
export const ChevronLeft = createIcon(IconChevronLeftOutline18, "ChevronLeft");
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRight = createIcon(
	IconChevronRightOutline18,
	"ChevronRight",
);
export const ChevronRightIcon = ChevronRight;
export const ChevronUp = createIcon(IconChevronUpOutline18, "ChevronUp");
export const ChevronUpIcon = ChevronUp;
export const ChevronsLeft = ChevronLeft;
export const ChevronsRight = ChevronRight;
export const ChevronsUpDown = createIcon(
	IconChevronExpandYOutline18,
	"ChevronsUpDown",
);
export const ChevronsUpDownIcon = ChevronsUpDown;
export const CircleAlertIcon = AlertTriangle;
export const CircleCheckIcon = CheckCircle2;
export const CircleIcon = createIcon(IconCircleInfoOutline18, "CircleIcon");
export const Clock = createIcon(IconAlarmClockOutline18, "Clock");
export const Copy = createIcon(IconClipboardOutline18, "Copy");
export const CornerDownRight = ChevronRight;
export const Edit = createIcon(IconPen3Outline18, "Edit");
export const ExternalLink = createIcon(IconLinkOutline18, "ExternalLink");
export const Eye = createIcon(IconEyeOpenOutline18, "Eye");
export const EyeOff = createIcon(IconEyeClosedOutline18, "EyeOff");
export const Filter = createIcon(IconFilterOutline18, "Filter");
export const Folder = createIcon(IconFolderOutline18, "Folder");
export const Globe = createIcon(IconEarthOutline18, "Globe");
export const Grid2X2 = createIcon(IconGridCirclePlusOutline18, "Grid2X2");
export const GripHorizontal = createIcon(
	IconAlign3HorizontalOutline18,
	"GripHorizontal",
);
export const GripVertical = createIcon(
	IconAlign3VerticalOutline18,
	"GripVertical",
);
export const GripVerticalIcon = GripVertical;
export const Heart = createIcon(IconHeartOutline18, "Heart");
export const HelpCircle = createIcon(IconCircleInfoOutline18, "HelpCircle");
export const Image = createIcon(IconImageOutline18, "Image");
export const ImageIcon = Image;
export const Info = createIcon(IconCircleInfoOutline18, "Info");
export const InfoIcon = Info;
export const KeyRound = createIcon(IconPassword2Outline18, "KeyRound");
export const LayoutDashboard = createIcon(
	IconWindowChartLineOutline18,
	"LayoutDashboard",
);
export const LayoutGrid = Grid2X2;
export const LayoutList = createIcon(IconUnorderedListOutline18, "LayoutList");
export const Loader2 = createIcon(IconLoaderOutline18, "Loader2");
export const Loader2Icon = Loader2;
export const LoaderCircleIcon = Loader2;
export const Locate = createIcon(IconCrosshairsOutline18, "Locate");
export const Lock = createIcon(IconLockOutline18, "Lock");
export const LockKeyholeIcon = Lock;
export const LogOut = createIcon(IconArrowDoorOut3Outline18, "LogOut");
export const Mail = createIcon(IconEnvelopeOutline18, "Mail");
export const Maximize = createIcon(
	IconWindowExpandBottomRightOutline18,
	"Maximize",
);
export const Megaphone = createIcon(IconBullhornOutline18, "Megaphone");
export const MessageSquare = createIcon(
	IconMsgWritingOutline18,
	"MessageSquare",
);
export const Minus = createIcon(IconMinusOutline18, "Minus");
export const MinusIcon = Minus;
export const Monitor = createIcon(IconComputerOutline18, "Monitor");
export const Moon = createIcon(IconDarkLightOutline18, "Moon");
export const MoreHorizontal = createIcon(
	IconAlign3HorizontalOutline18,
	"MoreHorizontal",
);
export const MoreHorizontalIcon = MoreHorizontal;
export const Network = createIcon(IconNodesOutline18, "Network");
export const PanelLeftIcon = createIcon(IconAlign3LeftOutline18, "PanelLeft");
export const Pencil = createIcon(IconPen3Outline18, "Pencil");
export const PlayCircle = createIcon(
	IconHalfDottedCirclePlayOutline18,
	"PlayCircle",
);
export const Plus = createIcon(IconPlusOutline18, "Plus");
export const PlusIcon = Plus;
export const RefreshCw = createIcon(
	IconArrowDottedRotateAnticlockwiseOutline18,
	"RefreshCw",
);
export const Search = createIcon(IconMagnifierOutline18, "Search");
export const SearchIcon = Search;
export const Send = createIcon(IconPaperPlane2Outline18, "Send");
export const Server = createIcon(IconBoxOutline18, "Server");
export const Settings = createIcon(IconGear2Outline18, "Settings");
export const Settings2 = Settings;
export const Shield = createIcon(IconShieldCheckOutline18, "Shield");
export const ShieldAlert = Shield;
export const ShieldCheck = Shield;
export const Sun = createIcon(IconLightbulb3Outline18, "Sun");
export const Trash = createIcon(IconTrashOutline18, "Trash");
export const Trash2 = Trash;
export const TriangleAlertIcon = AlertTriangle;
export const User = createIcon(IconUserOutline18, "User");
export const UserIcon = User;
export const UserX = createIcon(IconUserSearchOutline18, "UserX");
export const Users = createIcon(IconUsersOutline18, "Users");
export const Webhook = createIcon(IconSitemap4Outline18, "Webhook");
export const Wrench = createIcon(IconTextTool2Outline18, "Wrench");
export const X = createIcon(IconXmarkOutline18, "X");
export const XCircle = X;
export const XIcon = X;
