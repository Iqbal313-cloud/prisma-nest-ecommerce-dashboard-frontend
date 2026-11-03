import {
  navigation,
  type NavigationItem,
  type UserRole,
} from "../config/navigation";

export function getVisibleNavigation(role?: UserRole): NavigationItem[] {
  if (!role) return [];

  return navigation.filter((item) => item.allowedRoles.includes(role));
}

export function getDashboardItems(role?: UserRole) {
  const visibleNavigation = getVisibleNavigation(role);

  return visibleNavigation.flatMap((item) => {
  
    if ("children" in item) {
      return item.children.map((child) => ({
        title: child.title,
        href: child.href,
        icon: child.icon,
      }));
    }

    return [
      {
        title: item.title,
        href: item.href,
        icon: item.icon,
      },
    ];
  });
}
