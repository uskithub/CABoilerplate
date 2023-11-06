import { SwiftEnum, Empty, SwiftEnumCases } from "@shared/system/utils/enum";

export const DrawerContentType = {
    header: "header"
    , divider: "divider"
    , link: "link"
    , group: "group"
} as const;

export type DrawerContentType = typeof DrawerContentType[keyof typeof DrawerContentType];

type DrawerItem = {
    [DrawerContentType.header]: { title: string };
    [DrawerContentType.divider]: Empty;
    [DrawerContentType.link]: { title: string; href: string };
    [DrawerContentType.group]: { title: string, children: DrawerItems[] };
};

export const DrawerItem = new SwiftEnum<DrawerItem>;
export type DrawerItems = SwiftEnumCases<DrawerItem>