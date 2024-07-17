import React from "react"
import { HeaderProps } from "./Header.types"
import { StyledLogo } from "../../pages/StartingScreen/DebuggerFormSection/styles"
import evmLogo from "../../assets/svg/evm.svg"
import { Typography } from "@mui/material"
import { Wrapper } from "./Header.styles"
import { Section } from "../AlgaeSection"

export const Header: React.FC<HeaderProps> = () => {
    return <Section width="small">
        <Wrapper>
            <StyledLogo src={evmLogo} />
            <Typography variant='h4'>
                    Debugger
            </Typography>
        </Wrapper>
    </Section>
}