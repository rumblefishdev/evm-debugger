import { HeaderProps } from "./Header.types";

export let Header: React.FC<HeaderProps>;
try {
  Header = require('@rumblefishdev/ui/lib/src/components/Rumblefish23Theme/Header').Header;
} catch {
  Header = require('./Header.component').Header;
}