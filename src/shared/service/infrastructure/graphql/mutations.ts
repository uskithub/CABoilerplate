/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createProduct = /* GraphQL */ `
  mutation CreateProduct(
    $input: CreateProductInput!
    $condition: ModelProductConditionInput
  ) {
    createProduct(input: $input, condition: $condition) {
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
export const updateProduct = /* GraphQL */ `
  mutation UpdateProduct(
    $input: UpdateProductInput!
    $condition: ModelProductConditionInput
  ) {
    updateProduct(input: $input, condition: $condition) {
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
export const deleteProduct = /* GraphQL */ `
  mutation DeleteProduct(
    $input: DeleteProductInput!
    $condition: ModelProductConditionInput
  ) {
    deleteProduct(input: $input, condition: $condition) {
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
export const createCategory = /* GraphQL */ `
  mutation CreateCategory(
    $input: CreateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    createCategory(input: $input, condition: $condition) {
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
export const updateCategory = /* GraphQL */ `
  mutation UpdateCategory(
    $input: UpdateCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    updateCategory(input: $input, condition: $condition) {
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
export const deleteCategory = /* GraphQL */ `
  mutation DeleteCategory(
    $input: DeleteCategoryInput!
    $condition: ModelCategoryConditionInput
  ) {
    deleteCategory(input: $input, condition: $condition) {
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
export const createInsuranceItem = /* GraphQL */ `
  mutation CreateInsuranceItem(
    $input: CreateInsuranceItemInput!
    $condition: ModelInsuranceItemConditionInput
  ) {
    createInsuranceItem(input: $input, condition: $condition) {
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
export const updateInsuranceItem = /* GraphQL */ `
  mutation UpdateInsuranceItem(
    $input: UpdateInsuranceItemInput!
    $condition: ModelInsuranceItemConditionInput
  ) {
    updateInsuranceItem(input: $input, condition: $condition) {
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
export const deleteInsuranceItem = /* GraphQL */ `
  mutation DeleteInsuranceItem(
    $input: DeleteInsuranceItemInput!
    $condition: ModelInsuranceItemConditionInput
  ) {
    deleteInsuranceItem(input: $input, condition: $condition) {
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
export const createInsuranceRiderContract = /* GraphQL */ `
  mutation CreateInsuranceRiderContract(
    $input: CreateInsuranceRiderContractInput!
    $condition: ModelInsuranceRiderContractConditionInput
  ) {
    createInsuranceRiderContract(input: $input, condition: $condition) {
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
export const updateInsuranceRiderContract = /* GraphQL */ `
  mutation UpdateInsuranceRiderContract(
    $input: UpdateInsuranceRiderContractInput!
    $condition: ModelInsuranceRiderContractConditionInput
  ) {
    updateInsuranceRiderContract(input: $input, condition: $condition) {
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
export const deleteInsuranceRiderContract = /* GraphQL */ `
  mutation DeleteInsuranceRiderContract(
    $input: DeleteInsuranceRiderContractInput!
    $condition: ModelInsuranceRiderContractConditionInput
  ) {
    deleteInsuranceRiderContract(input: $input, condition: $condition) {
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
export const createPolicy = /* GraphQL */ `
  mutation CreatePolicy(
    $input: CreatePolicyInput!
    $condition: ModelPolicyConditionInput
  ) {
    createPolicy(input: $input, condition: $condition) {
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
export const updatePolicy = /* GraphQL */ `
  mutation UpdatePolicy(
    $input: UpdatePolicyInput!
    $condition: ModelPolicyConditionInput
  ) {
    updatePolicy(input: $input, condition: $condition) {
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
export const deletePolicy = /* GraphQL */ `
  mutation DeletePolicy(
    $input: DeletePolicyInput!
    $condition: ModelPolicyConditionInput
  ) {
    deletePolicy(input: $input, condition: $condition) {
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
export const createWarranty = /* GraphQL */ `
  mutation CreateWarranty(
    $input: CreateWarrantyInput!
    $condition: ModelWarrantyConditionInput
  ) {
    createWarranty(input: $input, condition: $condition) {
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
export const updateWarranty = /* GraphQL */ `
  mutation UpdateWarranty(
    $input: UpdateWarrantyInput!
    $condition: ModelWarrantyConditionInput
  ) {
    updateWarranty(input: $input, condition: $condition) {
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
export const deleteWarranty = /* GraphQL */ `
  mutation DeleteWarranty(
    $input: DeleteWarrantyInput!
    $condition: ModelWarrantyConditionInput
  ) {
    deleteWarranty(input: $input, condition: $condition) {
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
export const createClient = /* GraphQL */ `
  mutation CreateClient(
    $input: CreateClientInput!
    $condition: ModelClientConditionInput
  ) {
    createClient(input: $input, condition: $condition) {
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
export const updateClient = /* GraphQL */ `
  mutation UpdateClient(
    $input: UpdateClientInput!
    $condition: ModelClientConditionInput
  ) {
    updateClient(input: $input, condition: $condition) {
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
export const deleteClient = /* GraphQL */ `
  mutation DeleteClient(
    $input: DeleteClientInput!
    $condition: ModelClientConditionInput
  ) {
    deleteClient(input: $input, condition: $condition) {
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
export const createTarget = /* GraphQL */ `
  mutation CreateTarget(
    $input: CreateTargetInput!
    $condition: ModelTargetConditionInput
  ) {
    createTarget(input: $input, condition: $condition) {
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
export const updateTarget = /* GraphQL */ `
  mutation UpdateTarget(
    $input: UpdateTargetInput!
    $condition: ModelTargetConditionInput
  ) {
    updateTarget(input: $input, condition: $condition) {
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
export const deleteTarget = /* GraphQL */ `
  mutation DeleteTarget(
    $input: DeleteTargetInput!
    $condition: ModelTargetConditionInput
  ) {
    deleteTarget(input: $input, condition: $condition) {
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
