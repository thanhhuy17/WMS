import { Card, Space, Typography } from "antd";
import { colors } from "../constants/colors";
import { StatisticModel } from "../models/StatisticModel";
import { MdCurrencyRupee } from "react-icons/md";

interface Props {
  title: string;
  data: StatisticModel[];
}
const { Title, Text } = Typography;

const StatisticComponent = (props: Props) => {
  const { title, data } = props;

  return (
    <Card style={{height: "100%"}}>
      <Title style={{ color: colors.mainColor, fontWeight: 500, fontSize: 18 }}>
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
              className="d-flex mx-auto rounded p-1 mb-2"
              style={{
                width: 34,
                height: 34,
                fontSize: 26,
                color: item.color,
                backgroundColor: item.backgroundColor,
              }}
            >
              {item.icon}
            </div>
            {/* <Space className="d-flex justify-content-md-around"> */}
            <Space className={item.type !== 'vertical' ? 'd-flex justify-content-around' : 'd-flex flex-column'}>
              <Title className="m-0" level={5} style={{ color: item.color }}>
                {item.valueType === "currency" && <MdCurrencyRupee /> }
                {item.value}
              </Title>
              <Text>{item.description}</Text>
            </Space>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default StatisticComponent;
