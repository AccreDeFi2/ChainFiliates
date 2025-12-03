import { Pane, Text } from "evergreen-ui";
import Image from "next/future/image";
import ChainFiliatesLogoDark from "@/assets/chainfiliates-logos/chainfiliates-logo-dark.svg";
import React from "react";
import Anchor from "@/components/Anchor";

export const PoweredByChainFiliates = () => {
	return (
		<Pane display="flex" flexDirection="column" alignItems={"center"}>
			<Text
				display={"flex"}
				alignItems={"center"}
				justifyContent={"center"}
				fontSize={"0.8em"}
			>
				partnerships technology powered by{" "}
				<Anchor
					target="_blank"
					display={"flex"}
					href={"https://chainfiliates.so/?ref=app"}
				>
					<Image
						alt="logo"
						height={16}
						src={ChainFiliatesLogoDark}
						style={{ margin: 4, opacity: 0.85, width: "auto" }}
					/>
				</Anchor>
				— alpha release.
			</Text>
			{/* <Text fontSize={"0.8em"}>Please refer responsibly.</Text> */}
		</Pane>
	);
};
