# 接口文档
## 统一配置说明 用户请求时，header 中统一携带 uuid 字段，用于标识用户
```
    {
        "uuid": "1234567890",
        // 执行文件名
        "executable-name": "game"
    }
```
## 应用初始化配置
### 获取应用配置信息
- 接口路径: `/api/app/config`
- 请求方式: GET
- 请求参数: 无
- 响应数据:
  ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            "config": {
                "service_url": "https://service.example.com",
            }
        }
    }
  ```
### 游戏资源列表查询
- 接口路径: `/api/game-resources/list`
- 请求方式: GET
- 请求参数: 
  - `game_id`: 游戏ID
- 响应数据:
  ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            "list": [
                {
                    "id": "1234567890",
                    "game_id": "1234567890",
                    "name": "名称",
                    // 最后一次订单ID
                    "last_order_no": "1234567890",
                }
            ]
        }
    }
  ```
### 游戏资源详情
- 接口路径: `/api/game-resources/detail`
- 请求方式: GET
- 请求参数: 
  - `id`: 游戏资源ID
- 响应数据:
  ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            "game_resource": {
                "id": "1234567890",
                "game_id": "1234567890",
                "name": "名称",
                "last_order_no": "1234567890",
            }
        }
    }
  ```
## 订单相关
### 订单列表查询
- 接口路径: `/api/orders/list`
- 请求方式: GET
- 请求参数: 
  - `game_id`: 游戏ID
  - `status`: 订单状态
  - `page`: 页码
  - `limit`: 每页大小
- 响应数据:
  ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            "total": 100,
            "page": 1,
            "limit": 20,
            "list": [
                {
                    // 订单编号
                    "no": "1234567890",
                    // 游戏资源ID
                    "game_resource_id": "1234567890",
                    // 订单标题
                    "title": "订单标题",
                    // 支付金额 单位: 分
                    "amount": 100,
                    // 订单状态 1: 待支付 2: 已支付 3: 已取消 4: 已退款 5: 已过期
                    "status": "1",
                    // 订单创建时间
                    "created_at": "2021-01-01 00:00:00",
                    // 订单更新时间
                    "updated_at": "2021-01-01 00:00:00",
                    // 订单支付时间
                    "paid_at": "2021-01-01 00:00:00",
                }
            ]
        }
    }
  ```
### 创建订单
- 接口路径: `/api/orders/create`
- 请求方式: POST
- 请求参数: 
  - `game_resource_id`: 游戏资源ID
- 响应数据:
  ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            // 订单编号
            "no": "1234567890",
        }
    }
  ```
### 订单详情查询
- 接口路径: `/api/orders/info`
- 请求方式: GET
- 请求参数: 
  - `no`: 订单编号
- 响应数据:
  ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            "order": {
                "no": "1234567890",
                "title": "订单标题",
                "amount": 100,
                // 订单状态 1: 待支付 2: 已支付 3: 已取消 4: 已退款 5: 已过期
                "status": 1,
                "game_resource_id": "1234567890",
                "created_at": "2021-01-01 00:00:00",
                "updated_at": "2021-01-01 00:00:00",
                "paid_at": "2021-01-01 00:00:00",
                // 下载地址列表
                "download_list": [
                    "https://example.com/download1",
                    "https://example.com/download2",
                ]
            }
        }
    }
  ```

### 订单支付配置
- 接口路径: `/api/orders/pay-config`
- 请求方式: POST
- 请求参数: 
  - `no`: 订单id
- 响应数据:
  ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            "pay_config": {
                // 标题
                "title": "订单标题",
                // 说明
                "description": "订单说明",
                // 金额 单位: 分
                "amount": 100,
                // 金额说明
                "amount_desc": "金额说明",
                // 支付列表
                "pay_list": [
                    {
                        "name": "微信支付",
                        "icon": "https://example.com/icon.png",
                        "type": "wechat",
                    },
                    {
                        "name": "支付宝",
                        "icon": "https://example.com/icon.png",
                        "type": "alipay",
                    }
                ]
            }
        }
    }   
  ```
### 订单支付二维码数据
- 接口路径: `/api/orders/pay-data`
- 请求方式: GET
- 请求参数: 
  - `no`: 订单id
  - `pay_type`: 支付类型
- 响应数据:
  ```json
    {
        "code": 200,
        "message": "success",
        "data": {
            "qrcode_data": "https://example.com/pay"
        }
    }   
  ```
