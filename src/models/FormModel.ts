import { LiteralUnion } from "antd/es/_util/type"
import { SizeType } from "antd/es/config-provider/SizeContext"
import { FormLayout } from "antd/es/form/Form"
import { FormLabelAlign } from "antd/es/form/interface"

export interface FormModel {
    title: string
    layout?: FormLayout
    labelCol: number
    wrapperCol: number
    labelAlign: FormLabelAlign
    size?: SizeType
    nameButton?: string
    formItems: FormItemModel[]
}

export interface FormItemModel {
    key: string
    value: string
    label: string
    placeholder: string
    type: 'default' | 'input' | 'select' | 'number' | 'tel' | 'file' | 'button' | 'checkbox' | 'dateTime';
    require: boolean
    lockup_item: SelectModel[];
    message: string
    typeInput?: LiteralUnion<string>
    default_value: string
    displayLength: number
}

export interface SelectModel {
    label: string;
    value: string;
}