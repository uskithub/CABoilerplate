/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProduct = /* GraphQL */ `
  query GetProduct($id: ID!) {
    getProduct(id: $id) {
      id
      jancode
      effectiveEnd
      effectiveStart
      name
      categoryId
      category {
        id
        effectiveEnd
        effectiveStart
        name
        parentId
        createdAt
        updatedAt
        categoryChildrenId
      }
      createdAt
      updatedAt
      categoryProcuctsId
    }
  }
`;
export const listProducts = /* GraphQL */ `
  query ListProducts(
    $filter: ModelProductFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        jancode
        effectiveEnd
        effectiveStart
        name
        categoryId
        createdAt
        updatedAt
        categoryProcuctsId
      }
      nextToken
    }
  }
`;
export const getCategory = /* GraphQL */ `
  query GetCategory($id: ID!) {
    getCategory(id: $id) {
      id
      effectiveEnd
      effectiveStart
      name
      parentId
      parent {
        id
        effectiveEnd
        effectiveStart
        name
        parentId
        createdAt
        updatedAt
        categoryChildrenId
      }
      children {
        nextToken
      }
      procucts {
        nextToken
      }
      createdAt
      updatedAt
      categoryChildrenId
    }
  }
`;
export const listCategories = /* GraphQL */ `
  query ListCategories(
    $filter: ModelCategoryFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCategories(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        effectiveEnd
        effectiveStart
        name
        parentId
        createdAt
        updatedAt
        categoryChildrenId
      }
      nextToken
    }
  }
`;
export const getInsuranceItem = /* GraphQL */ `
  query GetInsuranceItem($id: ID!) {
    getInsuranceItem(id: $id) {
      id
      insuarancePriod
      rate
      productId
      product {
        id
        jancode
        effectiveEnd
        effectiveStart
        name
        categoryId
        createdAt
        updatedAt
        categoryProcuctsId
      }
      policyId
      policy {
        id
        effectiveEnd
        effectiveStart
        name
        line
        insurerId
        createdAt
        updatedAt
        insuranceRiderContractPoliciesId
      }
      createdAt
      updatedAt
    }
  }
`;
export const listInsuranceItems = /* GraphQL */ `
  query ListInsuranceItems(
    $filter: ModelInsuranceItemFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInsuranceItems(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        insuarancePriod
        rate
        productId
        policyId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getInsuranceRiderContract = /* GraphQL */ `
  query GetInsuranceRiderContract($id: ID!) {
    getInsuranceRiderContract(id: $id) {
      id
      effectiveEnd
      effectiveStart
      line
      policies {
        nextToken
      }
      createdAt
      updatedAt
    }
  }
`;
export const listInsuranceRiderContracts = /* GraphQL */ `
  query ListInsuranceRiderContracts(
    $filter: ModelInsuranceRiderContractFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInsuranceRiderContracts(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        effectiveEnd
        effectiveStart
        line
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPolicy = /* GraphQL */ `
  query GetPolicy($id: ID!) {
    getPolicy(id: $id) {
      id
      effectiveEnd
      effectiveStart
      name
      line
      insurerId
      insurer {
        id
        effectiveEnd
        effectiveStart
        name
        type
        address
        phone
        email
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
      insuranceRiderContractPoliciesId
    }
  }
`;
export const listPolicies = /* GraphQL */ `
  query ListPolicies(
    $filter: ModelPolicyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPolicies(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        effectiveEnd
        effectiveStart
        name
        line
        insurerId
        createdAt
        updatedAt
        insuranceRiderContractPoliciesId
      }
      nextToken
    }
  }
`;
export const getWarranty = /* GraphQL */ `
  query GetWarranty($id: ID!) {
    getWarranty(id: $id) {
      id
      effectiveEnd
      effectiveStart
      plan
      regulationId
      warrantyStartDate
      warrantyPeriod
      distributorId
      distributor {
        id
        effectiveEnd
        effectiveStart
        name
        type
        address
        phone
        email
        createdAt
        updatedAt
      }
      billingDestinationId
      billingDestination {
        id
        effectiveEnd
        effectiveStart
        name
        type
        address
        phone
        email
        createdAt
        updatedAt
      }
      targetId
      target {
        id
        type
        warrantyId
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listWarranties = /* GraphQL */ `
  query ListWarranties(
    $filter: ModelWarrantyFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listWarranties(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        effectiveEnd
        effectiveStart
        plan
        regulationId
        warrantyStartDate
        warrantyPeriod
        distributorId
        billingDestinationId
        targetId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getClient = /* GraphQL */ `
  query GetClient($id: ID!) {
    getClient(id: $id) {
      id
      effectiveEnd
      effectiveStart
      name
      type
      address
      phone
      email
      createdAt
      updatedAt
    }
  }
`;
export const listClients = /* GraphQL */ `
  query ListClients(
    $filter: ModelClientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listClients(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        effectiveEnd
        effectiveStart
        name
        type
        address
        phone
        email
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getTarget = /* GraphQL */ `
  query GetTarget($id: ID!) {
    getTarget(id: $id) {
      id
      type
      warrantyId
      warranty {
        id
        effectiveEnd
        effectiveStart
        plan
        regulationId
        warrantyStartDate
        warrantyPeriod
        distributorId
        billingDestinationId
        targetId
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`;
export const listTargets = /* GraphQL */ `
  query ListTargets(
    $filter: ModelTargetFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTargets(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        warrantyId
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
