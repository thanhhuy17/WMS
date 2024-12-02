// -------------- Get Tree Values --------------------
// export const getTreeValues = (data: any[], key: string) => {
//     const items: any[] = [];
//     const keys: string[] = [];
//     data.forEach((item) => {
//         if (item[`${key}`] && !keys.includes(item[`${key}`])) {
//             keys.push(item[`${key}`]);
//         }
//     });

//     data.forEach((item) => {
//         if (item[`${key}`]) {
//             // Tìm vị trí Index của Items
//             const index = items.findIndex(
//                 (element) => element.value === item[`${key}`]
//             );
//             // Lọc lấy ra children
//             const children = data.filter(
//                 (element) => element[`${key}`] === item[`${key}`]
//             );
//             // Thêm {title, value} vào items vị trí index của giá trị children.
//             if (index !== -1) {
//                 items[index].children = children.map((value) => ({
//                     title: value.title,
//                     value: value._id,
//                 }));
//             }
//         } else {
//             items.push({ title: item.title, value: item._id });
//         }
//     });

//     // console.log("Check Keys: ", keys);
//     // console.log("Check Items: ", items);
//     return items;
// };

export const getTreeValues = (data: any[], isSelect?: boolean) => {
    const values: any = [];
    const items = data.filter((element) => !element.parentId);
    const newItems = items.map((item) =>
        isSelect
            ? {
                label: item.title,
                value: item._id,
            }
            : { ...item, key: item._id }
    );

    newItems.forEach((item) => {
        const children = changeMenu(
            data,
            isSelect ? item.value : item._id,
            isSelect ?? false
        );
        values.push({
            ...item,
            children,
        });
    });

    return values;
};

export const changeMenu = (data: any[], id: string, isSelect: boolean) => {
    const items: any = [];
    const datas = data.filter((element) => element.parentId === id);

    datas.forEach((val) =>
        items.push(
            isSelect
                ? {
                    label: val.title,
                    value: val._id,
                    children: changeMenu(data, val._id, isSelect),
                }
                : {
                    ...val,
                    key: val._id,
                    children: changeMenu(data, val._id, isSelect),
                }
        )
    );
    return items;
};