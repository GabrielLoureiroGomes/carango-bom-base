import {
  DriveEta as DriveEtaIcon,
  People as PeopleIcon,
  Dashboard as DashboardIcon,
  BrandingWatermark as BrandingWatermarkIcon,
} from "@material-ui/icons";

const sidebarLinks = [
  { label: "Veículos", to: "/", isPublic: true, Icon: DriveEtaIcon },
  { label: "Marcas", to: "/marcas", Icon: BrandingWatermarkIcon },
  { label: "Usuários", to: "/usuarios", Icon: PeopleIcon },
  { label: "Dashboard", to: "/dashboard", Icon: DashboardIcon },
];

const authLinks = [
  { label: "Login", to: "/login" },
  { label: "Cadastro", to: "/cadastro" },
];

export const getLocationLabel = ({ pathname }) => {
  const link = [...authLinks, ...sidebarLinks].find(
    ({ to }) => to === pathname
  );
  if (!link) {
    return "";
  }
  return link.label;
};

export default sidebarLinks;
