import { FormLayout } from "antd/es/form/Form"

export interface FormModel {
    title: string
    layout?: FormLayout
    labelCol: number
    wrapperCol: number
    formItems: FormItem[]
}

export interface FormItem {
    key: string
    value: string
    label: string
    placeholder: string
    type: string
    require: boolean
    message: string
}