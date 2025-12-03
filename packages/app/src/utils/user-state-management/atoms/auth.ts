import { atom } from "jotai/index";
import { API_OPTIONS, AUTH_OPTIONS } from "@/constants";
import { Authenticate } from "@chainfiliates/auth";
import { Partnerships } from "@chainfiliates/partnerships";

const authenticationInstanceAtom = atom(
	() => new Authenticate({}, AUTH_OPTIONS)
);

const partnershipsInstanceAtom = atom(
	(get) => new Partnerships(get(authenticationInstanceAtom), API_OPTIONS)
);

export const chainfiliatesInstancesAtoms = {
	authentication: authenticationInstanceAtom,
	partnerships: partnershipsInstanceAtom
};
