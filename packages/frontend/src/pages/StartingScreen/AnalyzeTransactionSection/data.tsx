import byteCodeIcon from '../../../assets/png/AnalyzeTransactionIcons/byteCodeIcon.png'
import dependenciesIcon from '../../../assets/png/AnalyzeTransactionIcons/dependenciesIcon.png'
import emittedEventsInfoIcon from '../../../assets/png/AnalyzeTransactionIcons/emittedEventsInfoIcon.png'
import gasUsageIcon from '../../../assets/png/AnalyzeTransactionIcons/gasUsageIcon.png'
import nestedCallInfoIcon from '../../../assets/png/AnalyzeTransactionIcons/nestedCallInfoIcon.png'
import sourceCodeIcon from '../../../assets/png/AnalyzeTransactionIcons/sourceCodeIcon.png'
import stateChangesInfoIcon from '../../../assets/png/AnalyzeTransactionIcons/stateChangesInfoIcon.png'
import storageUpdateIcon from '../../../assets/png/AnalyzeTransactionIcons/storageUpdateIcon.png'

interface IData {
  text: string | JSX.Element
  icon: string
}
export const data: IData[] = [
  {
    text: 'detailed information about state changes of the transaction',
    icon: stateChangesInfoIcon,
  },
  {
    text: 'information about emitted events',
    icon: emittedEventsInfoIcon,
  },
  {
    text: 'visual graph of gas usage',
    icon: gasUsageIcon,
  },
  {
    text: 'info of every nested call made within the transaction',
    icon: nestedCallInfoIcon,
  },
  {
    text: 'bytecode of the smart contract',
    icon: byteCodeIcon,
  },
  {
    text: (
      <span>
        source code <br /> (if available)
      </span>
    ),
    icon: sourceCodeIcon,
  },
  {
    text: 'info on dependencies within the transaction',
    icon: dependenciesIcon,
  },
  {
    text: 'info about the storage updates',
    icon: storageUpdateIcon,
  },
]
