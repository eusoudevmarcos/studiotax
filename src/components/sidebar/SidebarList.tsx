import { TipoUsuarioEnum } from "@/schemas/funcionario.schema";
import { CalendarIcon, EmployeesIcon } from "../icons";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getNavItems = (user: any) => {
  const navItems = [];

  if (
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
    user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR ||
    user?.tipo === TipoUsuarioEnum.enum.VENDEDOR
  ) {
    navItems.push({
      icon: <span className="material-icons-outlined p-0 m-0">group</span>,
      label: "Clientes",
      href: "/clientes",
    });
  }

  if (user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA) {
    navItems.push({
      icon: <span className="material-icons-outlined">task</span>,
      label: "Taferas",
      href: "/kanban",
    });
  }

  if (
    user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA ||
    user?.tipo === TipoUsuarioEnum.enum.RECRUTADOR ||
    user?.tipo === TipoUsuarioEnum.enum.CLIENTE
  ) {
    navItems.push({
      icon: <CalendarIcon className="w-5 h-5 text-inherit" />,
      label: "Agenda",
      href: "/agenda",
    });
  }

  if (user?.tipo === TipoUsuarioEnum.enum.ADMIN_SISTEMA) {
    navItems.push({
      icon: <EmployeesIcon className="w-5 h-5 text-inherit" />,
      label: 'Usuarios do sistema',
      href: `/funcionarios`,
    });
  }

  return navItems;
};
