/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateProduct = /* GraphQL */ `
  subscription OnCreateProduct($filter: ModelSubscriptionProductFilterInput) {
    onCreateProduct(filter: $filter) {
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
export const onUpdateProduct = /* GraphQL */ `
  subscription OnUpdateProduct($filter: ModelSubscriptionProductFilterInput) {
    onUpdateProduct(filter: $filter) {
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
export const onDeleteProduct = /* GraphQL */ `
  subscription OnDeleteProduct($filter: ModelSubscriptionProductFilterInput) {
    onDeleteProduct(filter: $filter) {
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
export const onCreateCategory = /* GraphQL */ `
  subscription OnCreateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onCreateCategory(filter: $filter) {
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
export const onUpdateCategory = /* GraphQL */ `
  subscription OnUpdateCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onUpdateCategory(filter: $filter) {
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
export const onDeleteCategory = /* GraphQL */ `
  subscription OnDeleteCategory($filter: ModelSubscriptionCategoryFilterInput) {
    onDeleteCategory(filter: $filter) {
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
export const onCreateInsuranceItem = /* GraphQL */ `
  subscription OnCreateInsuranceItem(
    $filter: ModelSubscriptionInsuranceItemFilterInput
  ) {
    onCreateInsuranceItem(filter: $filter) {
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
export const onUpdateInsuranceItem = /* GraphQL */ `
  subscription OnUpdateInsuranceItem(
    $filter: ModelSubscriptionInsuranceItemFilterInput
  ) {
    onUpdateInsuranceItem(filter: $filter) {
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
export const onDeleteInsuranceItem = /* GraphQL */ `
  subscription OnDeleteInsuranceItem(
    $filter: ModelSubscriptionInsuranceItemFilterInput
  ) {
    onDeleteInsuranceItem(filter: $filter) {
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
export const onCreateInsuranceRiderContract = /* GraphQL */ `
  subscription OnCreateInsuranceRiderContract(
    $filter: ModelSubscriptionInsuranceRiderContractFilterInput
  ) {
    onCreateInsuranceRiderContract(filter: $filter) {
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
export const onUpdateInsuranceRiderContract = /* GraphQL */ `
  subscription OnUpdateInsuranceRiderContract(
    $filter: ModelSubscriptionInsuranceRiderContractFilterInput
  ) {
    onUpdateInsuranceRiderContract(filter: $filter) {
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
export const onDeleteInsuranceRiderContract = /* GraphQL */ `
  subscription OnDeleteInsuranceRiderContract(
    $filter: ModelSubscriptionInsuranceRiderContractFilterInput
  ) {
    onDeleteInsuranceRiderContract(filter: $filter) {
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
export const onCreatePolicy = /* GraphQL */ `
  subscription OnCreatePolicy($filter: ModelSubscriptionPolicyFilterInput) {
    onCreatePolicy(filter: $filter) {
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
export const onUpdatePolicy = /* GraphQL */ `
  subscription OnUpdatePolicy($filter: ModelSubscriptionPolicyFilterInput) {
    onUpdatePolicy(filter: $filter) {
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
export const onDeletePolicy = /* GraphQL */ `
  subscription OnDeletePolicy($filter: ModelSubscriptionPolicyFilterInput) {
    onDeletePolicy(filter: $filter) {
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
export const onCreateWarranty = /* GraphQL */ `
  subscription OnCreateWarranty($filter: ModelSubscriptionWarrantyFilterInput) {
    onCreateWarranty(filter: $filter) {
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
export const onUpdateWarranty = /* GraphQL */ `
  subscription OnUpdateWarranty($filter: ModelSubscriptionWarrantyFilterInput) {
    onUpdateWarranty(filter: $filter) {
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
export const onDeleteWarranty = /* GraphQL */ `
  subscription OnDeleteWarranty($filter: ModelSubscriptionWarrantyFilterInput) {
    onDeleteWarranty(filter: $filter) {
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
export const onCreateClient = /* GraphQL */ `
  subscription OnCreateClient($filter: ModelSubscriptionClientFilterInput) {
    onCreateClient(filter: $filter) {
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
export const onUpdateClient = /* GraphQL */ `
  subscription OnUpdateClient($filter: ModelSubscriptionClientFilterInput) {
    onUpdateClient(filter: $filter) {
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
export const onDeleteClient = /* GraphQL */ `
  subscription OnDeleteClient($filter: ModelSubscriptionClientFilterInput) {
    onDeleteClient(filter: $filter) {
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
export const onCreateTarget = /* GraphQL */ `
  subscription OnCreateTarget($filter: ModelSubscriptionTargetFilterInput) {
    onCreateTarget(filter: $filter) {
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
export const onUpdateTarget = /* GraphQL */ `
  subscription OnUpdateTarget($filter: ModelSubscriptionTargetFilterInput) {
    onUpdateTarget(filter: $filter) {
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
export const onDeleteTarget = /* GraphQL */ `
  subscription OnDeleteTarget($filter: ModelSubscriptionTargetFilterInput) {
    onDeleteTarget(filter: $filter) {
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
