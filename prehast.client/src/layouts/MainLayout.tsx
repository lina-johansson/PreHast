import { Layout, Menu, FloatButton, Row, Col, Grid } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    LogoutOutlined,
    UserSwitchOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import { Bell, Church, House, SquareChartGantt, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../../app/reducers/authSlice';
import { AppDispatch, RootState } from '../../app/store';
import { RULES } from '../Interfaces/roles';
import { IbasicUserInfo } from '../Interfaces/GeneralInterface';
import { Tooltip } from 'antd';

const { Header, Sider, Content, Footer } = Layout;
const { useBreakpoint } = Grid;

function MainLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const screens = useBreakpoint();

    const [collapsed, setCollapsed] = useState(false);
    const { userRoles, basicUserInfo } = useSelector((state: RootState) => state.auth.loginResponse);
    const [user, setUser] = useState<IbasicUserInfo>({} as IbasicUserInfo);

    const Admin = userRoles?.includes(RULES.Admin);
    const Manager = userRoles?.includes(RULES.Manager);

    useEffect(() => {
        setUser(basicUserInfo);
    }, [basicUserInfo]);

    const logou = async () => {
        const x = await dispatch(logout());
        if (x) navigate('/');
    };

    const items = [
        {
            key: '1',
            icon: <House style={{ color: '#C62300' }} />,
            label: <Tooltip title="hemsida"><Link to="/">Hem Sida</Link></Tooltip>,
        },
        {
            key: '3',
            icon: <TeamOutlined style={{ color: '#C62300' }} />,
            label: <Tooltip title="Patienter Data"><Link to="/ListPatientInfo">Patienter Data</Link></Tooltip>,
        },
        {
            key: '4',
            icon: <Bell style={{ color: '#C62300' }} />,
            label: <Tooltip title="Aviseringar"><Link to="/Aviseringar">Aviseringar</Link></Tooltip>,
        },
        {
            key: '5',
            icon: <SquareChartGantt style={{ color: '#C62300' }} />,
            label: 'System Administration',
            children: [
                {
                    key: '6',
                    icon: <Church style={{ color: '#C62300' }} />,
                    label: <Tooltip title="Frågor och svar"><Link to="/ListFragorOchSvar">Frågor och svar</Link></Tooltip>,
                },
            ],
        },
        {
            key: '7',
            icon: <UserSwitchOutlined style={{ color: '#C62300' }} />,
            label: 'Användar Hantering',
            children: [
                {
                    key: '8',
                    icon: <Users style={{ color: '#C62300' }} />,
                    label: <Link to="/Users">Användare</Link>,
                },
            ],
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            {/* Header */}
            <Header className="header s m-0 p-0" style={{ padding: 0 }}>
                <Row align="middle" justify="space-between" className="h-100">
                    <Col>
                        <h4 className="app-name" style={{ margin: '0 16px' }}>PRE HAST SYSTEM</h4>
                    </Col>
                    <Col className="user-info" style={{ minWidth: 'fit-content' }}>
                        <span className="logo-info">{user?.omfatningName}<span className="Slash">: </span>{user?.userName}</span>
                    </Col>
                    {
                        (!Admin && !Manager) &&
                        <FloatButton.Group
                            shape="circle"
                            style={{
                                left: 10,
                                bottom: 7,
                                height: 'fit-content',
                                width: 'fit-content',
                            }}
                        >
                            <FloatButton.BackTop
                                visibilityHeight={0}
                                icon={<LogoutOutlined   style={{ color: 'red',fontWeight:800 }} />}
                                onClick={logou}
                                style={{
                                    backgroundColor: 'black',
                                    color: 'red',
                                    border: 'none',
                                }}
                            />
                        </FloatButton.Group>
                    }
                </Row>
              
            </Header>

            <Layout>
                {/* Sider (Responsive) */}
                { (Admin || Manager) && (
                    <Sider
                        className="sider-1"
                        collapsible
                        collapsed={collapsed}
                        onCollapse={(value) => setCollapsed(value)}
                        width={250}
                        breakpoint="md"
                        style={{
                            overflow: 'auto',
                            marginTop: '64px',
                            marginBottom: '60px',
                            minHeight: '100vh',
                            borderRadius: '15px',
                            transition: 'all 0.2s ease',
                            backgroundColor: 'white',
                        }}
                    >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            style={{ background: 'transparent' }}
                            items={[
                                ...items,
                                {
                                    key: 'toggle',
                                    icon: collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />,
                                    label: 'Collapse / Expand',
                                    onClick: () => setCollapsed(!collapsed),
                                },
                                {
                                    key: 'logout',
                                    icon: <LogoutOutlined style={{ color: 'red' }} />,
                                    label: 'Logout',
                                    onClick: logou,
                                },
                            ]}
                        />
                        
                    </Sider>
                )}

                {/* Content Area */}
                <Content
                    style={{
                        padding: '20px 5px',
                        overflowY: 'auto',
                        height: '90vh',
                        marginTop: '64px',
                        width: '100%',
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>

            {/* Footer */}
            <Footer className="footer11">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                    <img src={'/assets/logoop.png'} width="30" height="30" alt="Logo" />
                    <span style={{ marginLeft: '10px' }}>اعداد مديرية صنف الحاسبات/شعبة تحليل الانظمة©2024</span>
                </div>
            </Footer>
        </Layout>
    );
}

export default MainLayout;
