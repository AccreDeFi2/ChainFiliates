import BrandLogomarkDark from "@/brand/brand-assets/ChainFiliates-Logomark-Dark.svg";
import BrandLogomarkLight from "@/brand/brand-assets/ChainFiliates-Logomark-Light.svg";
import BrandLogoDark from "@/brand/brand-assets/chainfiliates-logo-dark.svg";
import BrandLogoLight from "@/brand/brand-assets/chainfiliates-logo-light.svg";

/**
 * Why exporting it like this?
 * There are situations where ChainFiliates, as a technology, is required to be used as a reference.
 * In that case, we will import ChainFiliates-Logo directly.
 * If it' s a rebrand, we will use and modify BrandLogo instead.
 */
export { BrandLogoLight, BrandLogoDark, BrandLogomarkDark, BrandLogomarkLight };
