import { Card, Space, Typography } from "antd";
import { InventoryModel } from "../models/InventoryModel";
import { colors } from "../constants/colors";
import { MdCurrencyRupee } from "react-icons/md";

interface Props {
  title: string;
  data: InventoryModel[];
}

const { Title } = Typography;
const InventoryComponent = (props: Props) => {
  const { title, data } = props;
  return (
    <div>
      <Card>
        <Title style={{ fontSize: "20px", color: colors.mainColor }}>
          {title}
        </Title>
        <div className="row">
          {data.map((item, index) => (
            <div
              className="col"
              key={item.key}
              style={{
                borderRight: `${index < data.length - 1 ? 1 : 0}px solid ${
                  colors.gray_50
                }`,
              }}
            >
              <div
                style={{ color: item.color, fontWeight: 500, fontSize: "16px" }}
              >
                {item.description}
              </div>
              <Space className="d-flex justify-content-between">
                <div>
                  <div
                    className="mt-2"
                    style={{ color: colors.gray_600, fontWeight: 500 }}
                  >
                    {item.value}
                  </div>
                  <div className="mt-2" style={{ color: colors.gray_400 }}>
                    {item.status}
                  </div>
                </div>
                {item.typeShow !== "categories" && (
                  <div>
                    <div
                      className="mt-2 "
                      style={{ color: colors.gray_600, fontWeight: 500 }}
                    >
                      {item.valueType === "currency" && <MdCurrencyRupee style={{paddingBottom: '4px', fontSize: '16px'}}/>}
                      {item.cost}
                    </div>
                    <div className="mt-2" style={{ color: colors.gray_400 }}>
                      {item.costName}
                    </div>
                  </div>
                )}
              </Space>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default InventoryComponent;
