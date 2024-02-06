import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  IoArrowBack,
  IoChevronForward,
  IoGrid,
  IoPeopleCircle,
} from "react-icons/io5";
import { MenuButton } from "../../coremodules/MenuButton";
import usePermission, { Permission } from "../../hooks/usePermission";

interface MenuProps {
  closeMenu?: () => void;
}

type MenuItem = {
  title: string;
  route: string;
  exact?: boolean;
  icon?: React.ReactNode;
  anyOne?: boolean;
  permissions: Permission[];
};

interface MenuOption {
  group: string;
  basePath: string;
  Icon?: (props: { size: number; className: string }) => React.ReactElement;
  items: MenuItem[];
}

function Menu(props: MenuProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const permissions = usePermission();

  const menuOptions = useMemo<MenuOption[]>(
    () => [
      {
        group: "Agent Performance",
        basePath: "/gbm-crm/agent-performance",
        Icon: (props) => <IoPeopleCircle {...props} />,
        permissions: [],
        items: [
          {
            title: "Overview",
            permissions: [],
            anyOne: true,
            route: "/gbm-crm/agent-performance",
            exact: true,
          },
        ],
      },
    ],
    [permissions]
  );

  const [group, setGroup] = useState<string | null>(
    getCurrentGroup(location, menuOptions)
  );

  function backToMainMenu() {
    setGroup(null);
  }

  const groupOption = useMemo(
    () => getSelectedMenuOption(menuOptions, group),
    [group]
  );

  function onSelectGroup(next: string) {
    const nextGroup = group ? null : next;
    setGroup(nextGroup);
    if (nextGroup) {
      const options = getSelectedMenuOption(menuOptions, nextGroup);
      if (!options) return;
      const firstOption = options.items.find((i) =>
        permissions.isAllowed(i.permissions, true)
      );
      if (!firstOption) return;
      navigate(firstOption.route);
      props.closeMenu && props.closeMenu();
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full md:mx-2 md:my-4">
      <span className="md:hidden text-xl text-primary px-4 py-2">Menu</span>
      <MenuButton
        text="Dashboard"
        Icon={(props) => <IoGrid {...props} />}
        className="w-full"
        focused={isRouteFocused(location, false)}
        onClick={() => {
          navigate("/gbm-crm");
          backToMainMenu();
          props.closeMenu && props.closeMenu();
        }}
      />
      <hr className="w-3/4 mx-auto text-gray-light" />

      {menuOptions.map((option) => {
        const isMainMenu = group === null;
        const isSelected = group === option.group;
        const isFocused =
          isSelected ||
          getSegment(location.pathname, 1) === getSegment(option.basePath, 1);

        return (
          <MenuButton
            key={option.group}
            text={option.group}
            Icon={!isSelected || isMainMenu ? option.Icon : BackIcon}
            className={`${!isMainMenu && !isSelected ? "hidden" : ""} w-full`}
            focused={isFocused}
            onClick={() => onSelectGroup(option.group)}
          />
        );
      })}

      {!!groupOption && <hr className="w-3/4 mx-auto text-gray-light" />}
      {!groupOption
        ? null
        : groupOption.items.map((item) => {
            const isFocused = isRouteFocused(location, item.exact, item.route);
            if (!permissions.isAllowed(item.permissions, item.anyOne))
              return null;

            return (
              <MenuButton
                key={item.title}
                text={item.title}
                Icon={IoChevronForward}
                focused={isFocused}
                onClick={() => {
                  navigate(item.route);
                  props.closeMenu && props.closeMenu();
                }}
                animateHideIcon={!isFocused}
              />
            );
          })}
    </div>
  );
}

function getCurrentGroup(
  location: ReturnType<typeof useLocation>,
  menuOptions: MenuOption[]
) {
  const currentGroup = menuOptions.filter((g) =>
    g.items.find((o) => o.route === location.pathname)
  )?.[0];
  if (!currentGroup) return null;
  return currentGroup.group;
}

function BackIcon(props: any) {
  return <IoArrowBack {...props} />;
}

function getSelectedMenuOption(
  menuOptions: MenuOption[],
  group: string | null
): MenuOption | null {
  return menuOptions.filter((option) => option.group === group)[0] ?? null;
}

function getSegment(path: string, index: number) {
  return path.split("/").filter((s) => !!s)[index];
}

function isRouteFocused(
  location: ReturnType<typeof useLocation>,
  exact?: boolean,
  group?: string
) {
  if (group && !exact)
    return getSegment(location.pathname, 2) === getSegment(group, 2);

  if (group && exact) return location.pathname === group;

  return getSegment(location.pathname, 1) === group;
}

export default Menu;
