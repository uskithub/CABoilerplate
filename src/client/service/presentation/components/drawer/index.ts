import { SwiftEnum, Empty, SwiftEnumCases } from "@shared/system/utils/enum";

export const DrawerContentType = {
    header: "header"
    , divider: "divider"
    , link: "link"
    , group: "group"
} as const;

export type DrawerContentType = typeof DrawerContentType[keyof typeof DrawerContentType];

// これだと入力補完が利かないので
// type DrawerItems = {
//     [DrawerContentType.header]: { title: string };
//     [DrawerContentType.divider]: Empty;
//     [DrawerContentType.link]: { title: string; href: string };
//     [DrawerContentType.group]: { title: string, children: DrawerItems[] };
// };
// こうする
type DrawerItems = {
    header: { title: string };
    divider: Empty;
    link: { title: string; href: string };
    group: { title: string, children: DrawerItem[] };
};

export const DrawerItem = new SwiftEnum<DrawerItems>();
export type DrawerItem = SwiftEnumCases<DrawerItems>;
