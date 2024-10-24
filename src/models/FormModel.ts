import { LiteralUnion } from "antd/es/_util/type"
import { SizeType } from "antd/es/config-provider/SizeContext"
import { FormLayout } from "antd/es/form/Form"

export interface FormModel {
    title: string
    layout?: FormLayout
    labelCol: number
    wrapperCol: number
    formItems: FormItem[]
    size?: SizeType
}

export interface FormItem {
    key: string
    value: string
    label: string
    placeholder: string
    type: string
    require: boolean
    message: string
    typeInput?: LiteralUnion<string>

}