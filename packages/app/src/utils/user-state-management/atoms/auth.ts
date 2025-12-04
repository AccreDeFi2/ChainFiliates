import { atom } from "jotai/index";
import { API_OPTIONS, AUTH_OPTIONS } from "@/constants";
import { Authenticate } from "ChainFiliatess/auth";
import { Partnerships } from "ChainFiliatess/partnerships";

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
