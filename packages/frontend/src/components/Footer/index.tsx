import React from "react";

export let Footer: React.FC<{}>;
try {
  Footer = require('@rumblefishdev/ui/lib/src/components/Rumblefish23Theme/Footer').Footer;
} catch {
    Footer = require('./Footer.component').Footer;
}