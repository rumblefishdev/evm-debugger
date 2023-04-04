### Success

```
Small with call = 0x065834e296c07654e78d6ca0c1e6d5b5704483d8307cb85fdaad8d7846febe40
Small with call and static_call = 0x6011469ecd7cd7231e5c498a13dfbbe299e5cd275825132218aaa7e482f68fa6
Small with call static_call delegate_call = 0x4ffecc69700ff0c597c6e53cd09e89dce387d65fbbca59898ff60673d2762a0c
Large with call static_call delegate_call = 0xc6607cdbf8532b43348de8b23e23c9be0551d5aa4ea8dd3fa7a999223f27b101
Small with depth 5 = 0xf8936814ac2c6bda6dcd84b088cf9b8da01bdf2b196ff19a457cd875329b3ab8
Large with depth 7 = 0x6c96b89e56438976588b56e4f456fcf8bb2c71ba32fe60fb7da9f610a8e2771e
Large with depth 8 = 0xbca2954d1a0f2c842d50a3b87b378a88d648953177fca4c5712876bc62821e80
```

### Large with many simple transfers = 0xd79bb0939f4ce563f2dc4cfe6021c41cdbe5ac54126e20365d530436a3dff54e

```
Huge (103 calls) = 0xfc4087bc9c9d1448fba11fc807325ba4763c6fb1aad0c4eaf3c1afdb1c264b6c
Ultra huge (603 calls) = 0x5eecee2a4246afdc89bbfaa5d9b579d886d71e8b9e9d6259c9ccbd4621eb79dd
Ultra huge (1,216) = 0x096d89a022abd5b0620ad1321553d659ea090c7e94f25efbaf0c1f2d89a12ba3

Create = 0x6b96481a0c7077acf6e662de1225a3167967a99291e8a54a0fcbc3947896a60c
Create = 0xdd1dbaf9e8c798d8f6f8afb9964e0afde6e64f7746b5077f50aaa38675a4dfce
Create2 = 0x8733fe2859afb044abe28859e71486d24758706320fdf47eb280c5fbc9bee51f
Create2 = 0xc2f5ba78b790f704ba9376265b9484f08316101d275106f8823d94445dc03a7d
```

### Reverted

```
Small, not enough gas = 0x686ea9cae817a81da5b685eafe5542ded87d3369270c1bda9b0cb8f0dd3ab0a0
Create2, not enough gas = 0x5bd69cab4bbd5864a18ec23bd685d94c9ab58e94662409ea10fea756019e3c4f
```

### Custom error messages

```
Fail with error 'UniswapV2Router: INSUFFICIENT_OUTPUT_AMOUNT' = 0x6fc402c5fae0934dd4ab5dd474ffb67d64d935b5f0e59cd9ec21b3c732f17274
Fail with error 'Too little received' = 0x766a04580fe967d64f256faca666c6730ede8b856a29d7965bcbd81939b8d3a7
Fail with error 'UNIV3R: min return' = 0xc5b3dde3896bb9b46e290e7dbf178d9b024eaccb9f9996eb3aef90fd5f56df8b
Fail with error 'EXPIRY_PASSED' = 0x23f5a08269c1d65aafba50ee74a7ef8aaafc3e3f40cebaa7b4f0cc9f1c8c74a8
```

### Transaction succeeded but some part of it reverted:

```
0x57150470aa76e094379f50b606d3142367df6e2e07d4f8537703e6bd0c7d8b22
0x2013817f101e1455d4fdaba3e63faccb6a11c097f8c4f3b5030111f46b4451b6
0xaa453c0f5ae3f94f817a3f2a3242f77554971827e200d98b6cb4a764c4f0f671
0x85f717da90678267372b5581d41595b2bffdf524173f83dcfe8d7e541d8c2577
```
