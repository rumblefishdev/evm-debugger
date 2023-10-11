import type { DistinctChoice, ListQuestion, InputQuestion } from 'inquirer'
import inquirer from 'inquirer'

type TPromptValue<T> = { promptValue: T }

export const selectPrompt = <T>(
  message: string,
  choices: DistinctChoice[],
  options?: ListQuestion<TPromptValue<T>>,
): Promise<TPromptValue<T>> => {
  return inquirer.prompt<TPromptValue<T>>({
    type: 'list',
    name: 'promptValue',
    message,
    choices,
    ...options,
  })
}

export const inputPrompt = <T>(message: string, options?: InputQuestion<TPromptValue<T>>): Promise<TPromptValue<T>> => {
  return inquirer.prompt<TPromptValue<T>>({
    type: 'input',
    name: 'promptValue',
    message,
    ...options,
  })
}
