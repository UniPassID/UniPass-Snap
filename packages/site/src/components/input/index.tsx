import InternalInput from './input'
import type { InputProps } from './input'
import Password from './password'
import Code from './code'
import Counter from './counter'

type CompoundedComponent = React.ForwardRefExoticComponent<InputProps> & {
	Password: typeof Password
	Code: typeof Code
	Counter: typeof Counter
}

const Input = InternalInput as CompoundedComponent

Input.Password = Password
Input.Code = Code
Input.Counter = Counter

export default Input
