<script setup lang="ts">
import { inject, reactive } from "vue";
import type { Dispatcher } from "../../application/performers";
import { DISPATCHER_KEY } from "../../application/performers";
import { AuthorizedUser } from "@/shared/service/application/actors/authorizedUser";
import { SignInStatus } from "@/shared/service/domain/interfaces/authenticator";

const { stores, dispatch } = inject<Dispatcher>(DISPATCHER_KEY)!;

const state = reactive<{

}>({

});

type ListItem = {
    type?: string | undefined;
    title: string;
    value?: string | undefined;
};

const organizations = (): ListItem[] => {
    if (SignInStatus.signIn === stores.shared.signInStatus.case) {
        if (stores.shared.signInStatus.userProperties.organizationAndRoles.length === 0) {
            return [
               { type: "header", title: "参加中の組織はありません。" }
            ];
        }
        
        return ([
            { type: "header", title: "参加中の組織" }
        ] as ListItem[])
            .concat(stores.shared.signInStatus.userProperties.organizationAndRoles.map((i, idx) => {
                return {
                    title: i.name ?? ""
                    , value: i.organizationId
                };
            }));
    } else {
        return [];
    }
};

const actor = stores.shared.actor as AuthorizedUser;
const userProperties = actor.user;
userProperties?.organizationAndRoles

const _organizations = [
    { type: 'subheader', title: "参加中の組織" },
    {
        title: 'Item #1',
        value: 1,
    },
    {
        title: 'Item #2',
        value: 2,
    },
    {
        title: 'Item #3',
        value: 3,
    }
];

</script>

<template lang="pug">
v-container
  v-list(:items="organizations()")
</template>

<style lang="sass" scoped>
</style>