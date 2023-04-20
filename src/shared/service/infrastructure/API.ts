/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateProductInput = {
  id?: string | null,
  jancode: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name: string,
  categoryId: string,
  categoryProcuctsId?: string | null,
};

export type ModelProductConditionInput = {
  jancode?: ModelStringInput | null,
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  name?: ModelStringInput | null,
  categoryId?: ModelIDInput | null,
  and?: Array< ModelProductConditionInput | null > | null,
  or?: Array< ModelProductConditionInput | null > | null,
  not?: ModelProductConditionInput | null,
  categoryProcuctsId?: ModelIDInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type Product = {
  __typename: "Product",
  id: string,
  jancode: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name: string,
  categoryId: string,
  category?: Category | null,
  createdAt: string,
  updatedAt: string,
  categoryProcuctsId?: string | null,
};

export type Category = {
  __typename: "Category",
  id: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name: string,
  parentId?: string | null,
  parent?: Category | null,
  children?: ModelCategoryConnection | null,
  procucts?: ModelProductConnection | null,
  createdAt: string,
  updatedAt: string,
  categoryChildrenId?: string | null,
};

export type ModelCategoryConnection = {
  __typename: "ModelCategoryConnection",
  items:  Array<Category | null >,
  nextToken?: string | null,
};

export type ModelProductConnection = {
  __typename: "ModelProductConnection",
  items:  Array<Product | null >,
  nextToken?: string | null,
};

export type UpdateProductInput = {
  id: string,
  jancode?: string | null,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name?: string | null,
  categoryId?: string | null,
  categoryProcuctsId?: string | null,
};

export type DeleteProductInput = {
  id: string,
};

export type CreateCategoryInput = {
  id?: string | null,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name: string,
  parentId?: string | null,
  categoryChildrenId?: string | null,
};

export type ModelCategoryConditionInput = {
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  name?: ModelStringInput | null,
  parentId?: ModelIDInput | null,
  and?: Array< ModelCategoryConditionInput | null > | null,
  or?: Array< ModelCategoryConditionInput | null > | null,
  not?: ModelCategoryConditionInput | null,
  categoryChildrenId?: ModelIDInput | null,
};

export type UpdateCategoryInput = {
  id: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name?: string | null,
  parentId?: string | null,
  categoryChildrenId?: string | null,
};

export type DeleteCategoryInput = {
  id: string,
};

export type CreateInsuranceItemInput = {
  id?: string | null,
  insuarancePriod?: number | null,
  rate?: number | null,
  productId: string,
  policyId: string,
};

export type ModelInsuranceItemConditionInput = {
  insuarancePriod?: ModelIntInput | null,
  rate?: ModelFloatInput | null,
  productId?: ModelIDInput | null,
  policyId?: ModelIDInput | null,
  and?: Array< ModelInsuranceItemConditionInput | null > | null,
  or?: Array< ModelInsuranceItemConditionInput | null > | null,
  not?: ModelInsuranceItemConditionInput | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type InsuranceItem = {
  __typename: "InsuranceItem",
  id: string,
  insuarancePriod?: number | null,
  rate?: number | null,
  productId: string,
  product?: Product | null,
  policyId: string,
  policy?: Policy | null,
  createdAt: string,
  updatedAt: string,
};

export type Policy = {
  __typename: "Policy",
  id: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name: string,
  line: string,
  insurerId: string,
  insurer?: Client | null,
  createdAt: string,
  updatedAt: string,
  insuranceRiderContractPoliciesId?: string | null,
};

export type Client = {
  __typename: "Client",
  id: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name: string,
  type: string,
  address?: string | null,
  phone?: string | null,
  email?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateInsuranceItemInput = {
  id: string,
  insuarancePriod?: number | null,
  rate?: number | null,
  productId?: string | null,
  policyId?: string | null,
};

export type DeleteInsuranceItemInput = {
  id: string,
};

export type CreateInsuranceRiderContractInput = {
  id?: string | null,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  line: string,
};

export type ModelInsuranceRiderContractConditionInput = {
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  line?: ModelStringInput | null,
  and?: Array< ModelInsuranceRiderContractConditionInput | null > | null,
  or?: Array< ModelInsuranceRiderContractConditionInput | null > | null,
  not?: ModelInsuranceRiderContractConditionInput | null,
};

export type InsuranceRiderContract = {
  __typename: "InsuranceRiderContract",
  id: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  line: string,
  policies?: ModelPolicyConnection | null,
  createdAt: string,
  updatedAt: string,
};

export type ModelPolicyConnection = {
  __typename: "ModelPolicyConnection",
  items:  Array<Policy | null >,
  nextToken?: string | null,
};

export type UpdateInsuranceRiderContractInput = {
  id: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  line?: string | null,
};

export type DeleteInsuranceRiderContractInput = {
  id: string,
};

export type CreatePolicyInput = {
  id?: string | null,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name: string,
  line: string,
  insurerId: string,
  insuranceRiderContractPoliciesId?: string | null,
};

export type ModelPolicyConditionInput = {
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  name?: ModelStringInput | null,
  line?: ModelStringInput | null,
  insurerId?: ModelIDInput | null,
  and?: Array< ModelPolicyConditionInput | null > | null,
  or?: Array< ModelPolicyConditionInput | null > | null,
  not?: ModelPolicyConditionInput | null,
  insuranceRiderContractPoliciesId?: ModelIDInput | null,
};

export type UpdatePolicyInput = {
  id: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name?: string | null,
  line?: string | null,
  insurerId?: string | null,
  insuranceRiderContractPoliciesId?: string | null,
};

export type DeletePolicyInput = {
  id: string,
};

export type CreateWarrantyInput = {
  id?: string | null,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  plan: string,
  regulationId: string,
  warrantyStartDate?: string | null,
  warrantyPeriod?: number | null,
  distributorId: string,
  billingDestinationId: string,
  targetId: string,
};

export type ModelWarrantyConditionInput = {
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  plan?: ModelStringInput | null,
  regulationId?: ModelStringInput | null,
  warrantyStartDate?: ModelStringInput | null,
  warrantyPeriod?: ModelIntInput | null,
  distributorId?: ModelIDInput | null,
  billingDestinationId?: ModelIDInput | null,
  targetId?: ModelIDInput | null,
  and?: Array< ModelWarrantyConditionInput | null > | null,
  or?: Array< ModelWarrantyConditionInput | null > | null,
  not?: ModelWarrantyConditionInput | null,
};

export type Warranty = {
  __typename: "Warranty",
  id: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  plan: string,
  regulationId: string,
  warrantyStartDate?: string | null,
  warrantyPeriod?: number | null,
  distributorId: string,
  distributor?: Client | null,
  billingDestinationId: string,
  billingDestination?: Client | null,
  targetId: string,
  target?: Target | null,
  createdAt: string,
  updatedAt: string,
};

export type Target = {
  __typename: "Target",
  id: string,
  type: string,
  warrantyId: string,
  warranty?: Warranty | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdateWarrantyInput = {
  id: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  plan?: string | null,
  regulationId?: string | null,
  warrantyStartDate?: string | null,
  warrantyPeriod?: number | null,
  distributorId?: string | null,
  billingDestinationId?: string | null,
  targetId?: string | null,
};

export type DeleteWarrantyInput = {
  id: string,
};

export type CreateClientInput = {
  id?: string | null,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name: string,
  type: string,
  address?: string | null,
  phone?: string | null,
  email?: string | null,
};

export type ModelClientConditionInput = {
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  name?: ModelStringInput | null,
  type?: ModelStringInput | null,
  address?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  email?: ModelStringInput | null,
  and?: Array< ModelClientConditionInput | null > | null,
  or?: Array< ModelClientConditionInput | null > | null,
  not?: ModelClientConditionInput | null,
};

export type UpdateClientInput = {
  id: string,
  effectiveEnd?: string | null,
  effectiveStart?: string | null,
  name?: string | null,
  type?: string | null,
  address?: string | null,
  phone?: string | null,
  email?: string | null,
};

export type DeleteClientInput = {
  id: string,
};

export type CreateTargetInput = {
  id?: string | null,
  type: string,
  warrantyId: string,
};

export type ModelTargetConditionInput = {
  type?: ModelStringInput | null,
  warrantyId?: ModelIDInput | null,
  and?: Array< ModelTargetConditionInput | null > | null,
  or?: Array< ModelTargetConditionInput | null > | null,
  not?: ModelTargetConditionInput | null,
};

export type UpdateTargetInput = {
  id: string,
  type?: string | null,
  warrantyId?: string | null,
};

export type DeleteTargetInput = {
  id: string,
};

export type ModelProductFilterInput = {
  id?: ModelIDInput | null,
  jancode?: ModelStringInput | null,
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  name?: ModelStringInput | null,
  categoryId?: ModelIDInput | null,
  and?: Array< ModelProductFilterInput | null > | null,
  or?: Array< ModelProductFilterInput | null > | null,
  not?: ModelProductFilterInput | null,
  categoryProcuctsId?: ModelIDInput | null,
};

export type ModelCategoryFilterInput = {
  id?: ModelIDInput | null,
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  name?: ModelStringInput | null,
  parentId?: ModelIDInput | null,
  and?: Array< ModelCategoryFilterInput | null > | null,
  or?: Array< ModelCategoryFilterInput | null > | null,
  not?: ModelCategoryFilterInput | null,
  categoryChildrenId?: ModelIDInput | null,
};

export type ModelInsuranceItemFilterInput = {
  id?: ModelIDInput | null,
  insuarancePriod?: ModelIntInput | null,
  rate?: ModelFloatInput | null,
  productId?: ModelIDInput | null,
  policyId?: ModelIDInput | null,
  and?: Array< ModelInsuranceItemFilterInput | null > | null,
  or?: Array< ModelInsuranceItemFilterInput | null > | null,
  not?: ModelInsuranceItemFilterInput | null,
};

export type ModelInsuranceItemConnection = {
  __typename: "ModelInsuranceItemConnection",
  items:  Array<InsuranceItem | null >,
  nextToken?: string | null,
};

export type ModelInsuranceRiderContractFilterInput = {
  id?: ModelIDInput | null,
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  line?: ModelStringInput | null,
  and?: Array< ModelInsuranceRiderContractFilterInput | null > | null,
  or?: Array< ModelInsuranceRiderContractFilterInput | null > | null,
  not?: ModelInsuranceRiderContractFilterInput | null,
};

export type ModelInsuranceRiderContractConnection = {
  __typename: "ModelInsuranceRiderContractConnection",
  items:  Array<InsuranceRiderContract | null >,
  nextToken?: string | null,
};

export type ModelPolicyFilterInput = {
  id?: ModelIDInput | null,
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  name?: ModelStringInput | null,
  line?: ModelStringInput | null,
  insurerId?: ModelIDInput | null,
  and?: Array< ModelPolicyFilterInput | null > | null,
  or?: Array< ModelPolicyFilterInput | null > | null,
  not?: ModelPolicyFilterInput | null,
  insuranceRiderContractPoliciesId?: ModelIDInput | null,
};

export type ModelWarrantyFilterInput = {
  id?: ModelIDInput | null,
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  plan?: ModelStringInput | null,
  regulationId?: ModelStringInput | null,
  warrantyStartDate?: ModelStringInput | null,
  warrantyPeriod?: ModelIntInput | null,
  distributorId?: ModelIDInput | null,
  billingDestinationId?: ModelIDInput | null,
  targetId?: ModelIDInput | null,
  and?: Array< ModelWarrantyFilterInput | null > | null,
  or?: Array< ModelWarrantyFilterInput | null > | null,
  not?: ModelWarrantyFilterInput | null,
};

export type ModelWarrantyConnection = {
  __typename: "ModelWarrantyConnection",
  items:  Array<Warranty | null >,
  nextToken?: string | null,
};

export type ModelClientFilterInput = {
  id?: ModelIDInput | null,
  effectiveEnd?: ModelStringInput | null,
  effectiveStart?: ModelStringInput | null,
  name?: ModelStringInput | null,
  type?: ModelStringInput | null,
  address?: ModelStringInput | null,
  phone?: ModelStringInput | null,
  email?: ModelStringInput | null,
  and?: Array< ModelClientFilterInput | null > | null,
  or?: Array< ModelClientFilterInput | null > | null,
  not?: ModelClientFilterInput | null,
};

export type ModelClientConnection = {
  __typename: "ModelClientConnection",
  items:  Array<Client | null >,
  nextToken?: string | null,
};

export type ModelTargetFilterInput = {
  id?: ModelIDInput | null,
  type?: ModelStringInput | null,
  warrantyId?: ModelIDInput | null,
  and?: Array< ModelTargetFilterInput | null > | null,
  or?: Array< ModelTargetFilterInput | null > | null,
  not?: ModelTargetFilterInput | null,
};

export type ModelTargetConnection = {
  __typename: "ModelTargetConnection",
  items:  Array<Target | null >,
  nextToken?: string | null,
};

export type ModelSubscriptionProductFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  jancode?: ModelSubscriptionStringInput | null,
  effectiveEnd?: ModelSubscriptionStringInput | null,
  effectiveStart?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  categoryId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionProductFilterInput | null > | null,
  or?: Array< ModelSubscriptionProductFilterInput | null > | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionCategoryFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  effectiveEnd?: ModelSubscriptionStringInput | null,
  effectiveStart?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  parentId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionCategoryFilterInput | null > | null,
  or?: Array< ModelSubscriptionCategoryFilterInput | null > | null,
};

export type ModelSubscriptionInsuranceItemFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  insuarancePriod?: ModelSubscriptionIntInput | null,
  rate?: ModelSubscriptionFloatInput | null,
  productId?: ModelSubscriptionIDInput | null,
  policyId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionInsuranceItemFilterInput | null > | null,
  or?: Array< ModelSubscriptionInsuranceItemFilterInput | null > | null,
};

export type ModelSubscriptionIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type ModelSubscriptionInsuranceRiderContractFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  effectiveEnd?: ModelSubscriptionStringInput | null,
  effectiveStart?: ModelSubscriptionStringInput | null,
  line?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionInsuranceRiderContractFilterInput | null > | null,
  or?: Array< ModelSubscriptionInsuranceRiderContractFilterInput | null > | null,
};

export type ModelSubscriptionPolicyFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  effectiveEnd?: ModelSubscriptionStringInput | null,
  effectiveStart?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  line?: ModelSubscriptionStringInput | null,
  insurerId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionPolicyFilterInput | null > | null,
  or?: Array< ModelSubscriptionPolicyFilterInput | null > | null,
};

export type ModelSubscriptionWarrantyFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  effectiveEnd?: ModelSubscriptionStringInput | null,
  effectiveStart?: ModelSubscriptionStringInput | null,
  plan?: ModelSubscriptionStringInput | null,
  regulationId?: ModelSubscriptionStringInput | null,
  warrantyStartDate?: ModelSubscriptionStringInput | null,
  warrantyPeriod?: ModelSubscriptionIntInput | null,
  distributorId?: ModelSubscriptionIDInput | null,
  billingDestinationId?: ModelSubscriptionIDInput | null,
  targetId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionWarrantyFilterInput | null > | null,
  or?: Array< ModelSubscriptionWarrantyFilterInput | null > | null,
};

export type ModelSubscriptionClientFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  effectiveEnd?: ModelSubscriptionStringInput | null,
  effectiveStart?: ModelSubscriptionStringInput | null,
  name?: ModelSubscriptionStringInput | null,
  type?: ModelSubscriptionStringInput | null,
  address?: ModelSubscriptionStringInput | null,
  phone?: ModelSubscriptionStringInput | null,
  email?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionClientFilterInput | null > | null,
  or?: Array< ModelSubscriptionClientFilterInput | null > | null,
};

export type ModelSubscriptionTargetFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  type?: ModelSubscriptionStringInput | null,
  warrantyId?: ModelSubscriptionIDInput | null,
  and?: Array< ModelSubscriptionTargetFilterInput | null > | null,
  or?: Array< ModelSubscriptionTargetFilterInput | null > | null,
};

export type CreateProductMutationVariables = {
  input: CreateProductInput,
  condition?: ModelProductConditionInput | null,
};

export type CreateProductMutation = {
  createProduct?:  {
    __typename: "Product",
    id: string,
    jancode: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    categoryId: string,
    category?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryProcuctsId?: string | null,
  } | null,
};

export type UpdateProductMutationVariables = {
  input: UpdateProductInput,
  condition?: ModelProductConditionInput | null,
};

export type UpdateProductMutation = {
  updateProduct?:  {
    __typename: "Product",
    id: string,
    jancode: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    categoryId: string,
    category?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryProcuctsId?: string | null,
  } | null,
};

export type DeleteProductMutationVariables = {
  input: DeleteProductInput,
  condition?: ModelProductConditionInput | null,
};

export type DeleteProductMutation = {
  deleteProduct?:  {
    __typename: "Product",
    id: string,
    jancode: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    categoryId: string,
    category?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryProcuctsId?: string | null,
  } | null,
};

export type CreateCategoryMutationVariables = {
  input: CreateCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type CreateCategoryMutation = {
  createCategory?:  {
    __typename: "Category",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    parentId?: string | null,
    parent?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    children?:  {
      __typename: "ModelCategoryConnection",
      nextToken?: string | null,
    } | null,
    procucts?:  {
      __typename: "ModelProductConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryChildrenId?: string | null,
  } | null,
};

export type UpdateCategoryMutationVariables = {
  input: UpdateCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type UpdateCategoryMutation = {
  updateCategory?:  {
    __typename: "Category",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    parentId?: string | null,
    parent?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    children?:  {
      __typename: "ModelCategoryConnection",
      nextToken?: string | null,
    } | null,
    procucts?:  {
      __typename: "ModelProductConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryChildrenId?: string | null,
  } | null,
};

export type DeleteCategoryMutationVariables = {
  input: DeleteCategoryInput,
  condition?: ModelCategoryConditionInput | null,
};

export type DeleteCategoryMutation = {
  deleteCategory?:  {
    __typename: "Category",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    parentId?: string | null,
    parent?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    children?:  {
      __typename: "ModelCategoryConnection",
      nextToken?: string | null,
    } | null,
    procucts?:  {
      __typename: "ModelProductConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryChildrenId?: string | null,
  } | null,
};

export type CreateInsuranceItemMutationVariables = {
  input: CreateInsuranceItemInput,
  condition?: ModelInsuranceItemConditionInput | null,
};

export type CreateInsuranceItemMutation = {
  createInsuranceItem?:  {
    __typename: "InsuranceItem",
    id: string,
    insuarancePriod?: number | null,
    rate?: number | null,
    productId: string,
    product?:  {
      __typename: "Product",
      id: string,
      jancode: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      categoryId: string,
      createdAt: string,
      updatedAt: string,
      categoryProcuctsId?: string | null,
    } | null,
    policyId: string,
    policy?:  {
      __typename: "Policy",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      line: string,
      insurerId: string,
      createdAt: string,
      updatedAt: string,
      insuranceRiderContractPoliciesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInsuranceItemMutationVariables = {
  input: UpdateInsuranceItemInput,
  condition?: ModelInsuranceItemConditionInput | null,
};

export type UpdateInsuranceItemMutation = {
  updateInsuranceItem?:  {
    __typename: "InsuranceItem",
    id: string,
    insuarancePriod?: number | null,
    rate?: number | null,
    productId: string,
    product?:  {
      __typename: "Product",
      id: string,
      jancode: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      categoryId: string,
      createdAt: string,
      updatedAt: string,
      categoryProcuctsId?: string | null,
    } | null,
    policyId: string,
    policy?:  {
      __typename: "Policy",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      line: string,
      insurerId: string,
      createdAt: string,
      updatedAt: string,
      insuranceRiderContractPoliciesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInsuranceItemMutationVariables = {
  input: DeleteInsuranceItemInput,
  condition?: ModelInsuranceItemConditionInput | null,
};

export type DeleteInsuranceItemMutation = {
  deleteInsuranceItem?:  {
    __typename: "InsuranceItem",
    id: string,
    insuarancePriod?: number | null,
    rate?: number | null,
    productId: string,
    product?:  {
      __typename: "Product",
      id: string,
      jancode: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      categoryId: string,
      createdAt: string,
      updatedAt: string,
      categoryProcuctsId?: string | null,
    } | null,
    policyId: string,
    policy?:  {
      __typename: "Policy",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      line: string,
      insurerId: string,
      createdAt: string,
      updatedAt: string,
      insuranceRiderContractPoliciesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateInsuranceRiderContractMutationVariables = {
  input: CreateInsuranceRiderContractInput,
  condition?: ModelInsuranceRiderContractConditionInput | null,
};

export type CreateInsuranceRiderContractMutation = {
  createInsuranceRiderContract?:  {
    __typename: "InsuranceRiderContract",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    line: string,
    policies?:  {
      __typename: "ModelPolicyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateInsuranceRiderContractMutationVariables = {
  input: UpdateInsuranceRiderContractInput,
  condition?: ModelInsuranceRiderContractConditionInput | null,
};

export type UpdateInsuranceRiderContractMutation = {
  updateInsuranceRiderContract?:  {
    __typename: "InsuranceRiderContract",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    line: string,
    policies?:  {
      __typename: "ModelPolicyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteInsuranceRiderContractMutationVariables = {
  input: DeleteInsuranceRiderContractInput,
  condition?: ModelInsuranceRiderContractConditionInput | null,
};

export type DeleteInsuranceRiderContractMutation = {
  deleteInsuranceRiderContract?:  {
    __typename: "InsuranceRiderContract",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    line: string,
    policies?:  {
      __typename: "ModelPolicyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePolicyMutationVariables = {
  input: CreatePolicyInput,
  condition?: ModelPolicyConditionInput | null,
};

export type CreatePolicyMutation = {
  createPolicy?:  {
    __typename: "Policy",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    line: string,
    insurerId: string,
    insurer?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    insuranceRiderContractPoliciesId?: string | null,
  } | null,
};

export type UpdatePolicyMutationVariables = {
  input: UpdatePolicyInput,
  condition?: ModelPolicyConditionInput | null,
};

export type UpdatePolicyMutation = {
  updatePolicy?:  {
    __typename: "Policy",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    line: string,
    insurerId: string,
    insurer?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    insuranceRiderContractPoliciesId?: string | null,
  } | null,
};

export type DeletePolicyMutationVariables = {
  input: DeletePolicyInput,
  condition?: ModelPolicyConditionInput | null,
};

export type DeletePolicyMutation = {
  deletePolicy?:  {
    __typename: "Policy",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    line: string,
    insurerId: string,
    insurer?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    insuranceRiderContractPoliciesId?: string | null,
  } | null,
};

export type CreateWarrantyMutationVariables = {
  input: CreateWarrantyInput,
  condition?: ModelWarrantyConditionInput | null,
};

export type CreateWarrantyMutation = {
  createWarranty?:  {
    __typename: "Warranty",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    plan: string,
    regulationId: string,
    warrantyStartDate?: string | null,
    warrantyPeriod?: number | null,
    distributorId: string,
    distributor?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    billingDestinationId: string,
    billingDestination?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    targetId: string,
    target?:  {
      __typename: "Target",
      id: string,
      type: string,
      warrantyId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateWarrantyMutationVariables = {
  input: UpdateWarrantyInput,
  condition?: ModelWarrantyConditionInput | null,
};

export type UpdateWarrantyMutation = {
  updateWarranty?:  {
    __typename: "Warranty",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    plan: string,
    regulationId: string,
    warrantyStartDate?: string | null,
    warrantyPeriod?: number | null,
    distributorId: string,
    distributor?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    billingDestinationId: string,
    billingDestination?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    targetId: string,
    target?:  {
      __typename: "Target",
      id: string,
      type: string,
      warrantyId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteWarrantyMutationVariables = {
  input: DeleteWarrantyInput,
  condition?: ModelWarrantyConditionInput | null,
};

export type DeleteWarrantyMutation = {
  deleteWarranty?:  {
    __typename: "Warranty",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    plan: string,
    regulationId: string,
    warrantyStartDate?: string | null,
    warrantyPeriod?: number | null,
    distributorId: string,
    distributor?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    billingDestinationId: string,
    billingDestination?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    targetId: string,
    target?:  {
      __typename: "Target",
      id: string,
      type: string,
      warrantyId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateClientMutationVariables = {
  input: CreateClientInput,
  condition?: ModelClientConditionInput | null,
};

export type CreateClientMutation = {
  createClient?:  {
    __typename: "Client",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    type: string,
    address?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateClientMutationVariables = {
  input: UpdateClientInput,
  condition?: ModelClientConditionInput | null,
};

export type UpdateClientMutation = {
  updateClient?:  {
    __typename: "Client",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    type: string,
    address?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteClientMutationVariables = {
  input: DeleteClientInput,
  condition?: ModelClientConditionInput | null,
};

export type DeleteClientMutation = {
  deleteClient?:  {
    __typename: "Client",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    type: string,
    address?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreateTargetMutationVariables = {
  input: CreateTargetInput,
  condition?: ModelTargetConditionInput | null,
};

export type CreateTargetMutation = {
  createTarget?:  {
    __typename: "Target",
    id: string,
    type: string,
    warrantyId: string,
    warranty?:  {
      __typename: "Warranty",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      plan: string,
      regulationId: string,
      warrantyStartDate?: string | null,
      warrantyPeriod?: number | null,
      distributorId: string,
      billingDestinationId: string,
      targetId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateTargetMutationVariables = {
  input: UpdateTargetInput,
  condition?: ModelTargetConditionInput | null,
};

export type UpdateTargetMutation = {
  updateTarget?:  {
    __typename: "Target",
    id: string,
    type: string,
    warrantyId: string,
    warranty?:  {
      __typename: "Warranty",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      plan: string,
      regulationId: string,
      warrantyStartDate?: string | null,
      warrantyPeriod?: number | null,
      distributorId: string,
      billingDestinationId: string,
      targetId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteTargetMutationVariables = {
  input: DeleteTargetInput,
  condition?: ModelTargetConditionInput | null,
};

export type DeleteTargetMutation = {
  deleteTarget?:  {
    __typename: "Target",
    id: string,
    type: string,
    warrantyId: string,
    warranty?:  {
      __typename: "Warranty",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      plan: string,
      regulationId: string,
      warrantyStartDate?: string | null,
      warrantyPeriod?: number | null,
      distributorId: string,
      billingDestinationId: string,
      targetId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetProductQueryVariables = {
  id: string,
};

export type GetProductQuery = {
  getProduct?:  {
    __typename: "Product",
    id: string,
    jancode: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    categoryId: string,
    category?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryProcuctsId?: string | null,
  } | null,
};

export type ListProductsQueryVariables = {
  filter?: ModelProductFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListProductsQuery = {
  listProducts?:  {
    __typename: "ModelProductConnection",
    items:  Array< {
      __typename: "Product",
      id: string,
      jancode: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      categoryId: string,
      createdAt: string,
      updatedAt: string,
      categoryProcuctsId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetCategoryQueryVariables = {
  id: string,
};

export type GetCategoryQuery = {
  getCategory?:  {
    __typename: "Category",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    parentId?: string | null,
    parent?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    children?:  {
      __typename: "ModelCategoryConnection",
      nextToken?: string | null,
    } | null,
    procucts?:  {
      __typename: "ModelProductConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryChildrenId?: string | null,
  } | null,
};

export type ListCategoriesQueryVariables = {
  filter?: ModelCategoryFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListCategoriesQuery = {
  listCategories?:  {
    __typename: "ModelCategoryConnection",
    items:  Array< {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetInsuranceItemQueryVariables = {
  id: string,
};

export type GetInsuranceItemQuery = {
  getInsuranceItem?:  {
    __typename: "InsuranceItem",
    id: string,
    insuarancePriod?: number | null,
    rate?: number | null,
    productId: string,
    product?:  {
      __typename: "Product",
      id: string,
      jancode: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      categoryId: string,
      createdAt: string,
      updatedAt: string,
      categoryProcuctsId?: string | null,
    } | null,
    policyId: string,
    policy?:  {
      __typename: "Policy",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      line: string,
      insurerId: string,
      createdAt: string,
      updatedAt: string,
      insuranceRiderContractPoliciesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInsuranceItemsQueryVariables = {
  filter?: ModelInsuranceItemFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListInsuranceItemsQuery = {
  listInsuranceItems?:  {
    __typename: "ModelInsuranceItemConnection",
    items:  Array< {
      __typename: "InsuranceItem",
      id: string,
      insuarancePriod?: number | null,
      rate?: number | null,
      productId: string,
      policyId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetInsuranceRiderContractQueryVariables = {
  id: string,
};

export type GetInsuranceRiderContractQuery = {
  getInsuranceRiderContract?:  {
    __typename: "InsuranceRiderContract",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    line: string,
    policies?:  {
      __typename: "ModelPolicyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListInsuranceRiderContractsQueryVariables = {
  filter?: ModelInsuranceRiderContractFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListInsuranceRiderContractsQuery = {
  listInsuranceRiderContracts?:  {
    __typename: "ModelInsuranceRiderContractConnection",
    items:  Array< {
      __typename: "InsuranceRiderContract",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      line: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPolicyQueryVariables = {
  id: string,
};

export type GetPolicyQuery = {
  getPolicy?:  {
    __typename: "Policy",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    line: string,
    insurerId: string,
    insurer?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    insuranceRiderContractPoliciesId?: string | null,
  } | null,
};

export type ListPoliciesQueryVariables = {
  filter?: ModelPolicyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListPoliciesQuery = {
  listPolicies?:  {
    __typename: "ModelPolicyConnection",
    items:  Array< {
      __typename: "Policy",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      line: string,
      insurerId: string,
      createdAt: string,
      updatedAt: string,
      insuranceRiderContractPoliciesId?: string | null,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetWarrantyQueryVariables = {
  id: string,
};

export type GetWarrantyQuery = {
  getWarranty?:  {
    __typename: "Warranty",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    plan: string,
    regulationId: string,
    warrantyStartDate?: string | null,
    warrantyPeriod?: number | null,
    distributorId: string,
    distributor?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    billingDestinationId: string,
    billingDestination?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    targetId: string,
    target?:  {
      __typename: "Target",
      id: string,
      type: string,
      warrantyId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListWarrantiesQueryVariables = {
  filter?: ModelWarrantyFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListWarrantiesQuery = {
  listWarranties?:  {
    __typename: "ModelWarrantyConnection",
    items:  Array< {
      __typename: "Warranty",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      plan: string,
      regulationId: string,
      warrantyStartDate?: string | null,
      warrantyPeriod?: number | null,
      distributorId: string,
      billingDestinationId: string,
      targetId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetClientQueryVariables = {
  id: string,
};

export type GetClientQuery = {
  getClient?:  {
    __typename: "Client",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    type: string,
    address?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListClientsQueryVariables = {
  filter?: ModelClientFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListClientsQuery = {
  listClients?:  {
    __typename: "ModelClientConnection",
    items:  Array< {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetTargetQueryVariables = {
  id: string,
};

export type GetTargetQuery = {
  getTarget?:  {
    __typename: "Target",
    id: string,
    type: string,
    warrantyId: string,
    warranty?:  {
      __typename: "Warranty",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      plan: string,
      regulationId: string,
      warrantyStartDate?: string | null,
      warrantyPeriod?: number | null,
      distributorId: string,
      billingDestinationId: string,
      targetId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListTargetsQueryVariables = {
  filter?: ModelTargetFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListTargetsQuery = {
  listTargets?:  {
    __typename: "ModelTargetConnection",
    items:  Array< {
      __typename: "Target",
      id: string,
      type: string,
      warrantyId: string,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
};

export type OnCreateProductSubscription = {
  onCreateProduct?:  {
    __typename: "Product",
    id: string,
    jancode: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    categoryId: string,
    category?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryProcuctsId?: string | null,
  } | null,
};

export type OnUpdateProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
};

export type OnUpdateProductSubscription = {
  onUpdateProduct?:  {
    __typename: "Product",
    id: string,
    jancode: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    categoryId: string,
    category?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryProcuctsId?: string | null,
  } | null,
};

export type OnDeleteProductSubscriptionVariables = {
  filter?: ModelSubscriptionProductFilterInput | null,
};

export type OnDeleteProductSubscription = {
  onDeleteProduct?:  {
    __typename: "Product",
    id: string,
    jancode: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    categoryId: string,
    category?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryProcuctsId?: string | null,
  } | null,
};

export type OnCreateCategorySubscriptionVariables = {
  filter?: ModelSubscriptionCategoryFilterInput | null,
};

export type OnCreateCategorySubscription = {
  onCreateCategory?:  {
    __typename: "Category",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    parentId?: string | null,
    parent?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    children?:  {
      __typename: "ModelCategoryConnection",
      nextToken?: string | null,
    } | null,
    procucts?:  {
      __typename: "ModelProductConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryChildrenId?: string | null,
  } | null,
};

export type OnUpdateCategorySubscriptionVariables = {
  filter?: ModelSubscriptionCategoryFilterInput | null,
};

export type OnUpdateCategorySubscription = {
  onUpdateCategory?:  {
    __typename: "Category",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    parentId?: string | null,
    parent?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    children?:  {
      __typename: "ModelCategoryConnection",
      nextToken?: string | null,
    } | null,
    procucts?:  {
      __typename: "ModelProductConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryChildrenId?: string | null,
  } | null,
};

export type OnDeleteCategorySubscriptionVariables = {
  filter?: ModelSubscriptionCategoryFilterInput | null,
};

export type OnDeleteCategorySubscription = {
  onDeleteCategory?:  {
    __typename: "Category",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    parentId?: string | null,
    parent?:  {
      __typename: "Category",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      parentId?: string | null,
      createdAt: string,
      updatedAt: string,
      categoryChildrenId?: string | null,
    } | null,
    children?:  {
      __typename: "ModelCategoryConnection",
      nextToken?: string | null,
    } | null,
    procucts?:  {
      __typename: "ModelProductConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
    categoryChildrenId?: string | null,
  } | null,
};

export type OnCreateInsuranceItemSubscriptionVariables = {
  filter?: ModelSubscriptionInsuranceItemFilterInput | null,
};

export type OnCreateInsuranceItemSubscription = {
  onCreateInsuranceItem?:  {
    __typename: "InsuranceItem",
    id: string,
    insuarancePriod?: number | null,
    rate?: number | null,
    productId: string,
    product?:  {
      __typename: "Product",
      id: string,
      jancode: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      categoryId: string,
      createdAt: string,
      updatedAt: string,
      categoryProcuctsId?: string | null,
    } | null,
    policyId: string,
    policy?:  {
      __typename: "Policy",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      line: string,
      insurerId: string,
      createdAt: string,
      updatedAt: string,
      insuranceRiderContractPoliciesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInsuranceItemSubscriptionVariables = {
  filter?: ModelSubscriptionInsuranceItemFilterInput | null,
};

export type OnUpdateInsuranceItemSubscription = {
  onUpdateInsuranceItem?:  {
    __typename: "InsuranceItem",
    id: string,
    insuarancePriod?: number | null,
    rate?: number | null,
    productId: string,
    product?:  {
      __typename: "Product",
      id: string,
      jancode: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      categoryId: string,
      createdAt: string,
      updatedAt: string,
      categoryProcuctsId?: string | null,
    } | null,
    policyId: string,
    policy?:  {
      __typename: "Policy",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      line: string,
      insurerId: string,
      createdAt: string,
      updatedAt: string,
      insuranceRiderContractPoliciesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInsuranceItemSubscriptionVariables = {
  filter?: ModelSubscriptionInsuranceItemFilterInput | null,
};

export type OnDeleteInsuranceItemSubscription = {
  onDeleteInsuranceItem?:  {
    __typename: "InsuranceItem",
    id: string,
    insuarancePriod?: number | null,
    rate?: number | null,
    productId: string,
    product?:  {
      __typename: "Product",
      id: string,
      jancode: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      categoryId: string,
      createdAt: string,
      updatedAt: string,
      categoryProcuctsId?: string | null,
    } | null,
    policyId: string,
    policy?:  {
      __typename: "Policy",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      line: string,
      insurerId: string,
      createdAt: string,
      updatedAt: string,
      insuranceRiderContractPoliciesId?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateInsuranceRiderContractSubscriptionVariables = {
  filter?: ModelSubscriptionInsuranceRiderContractFilterInput | null,
};

export type OnCreateInsuranceRiderContractSubscription = {
  onCreateInsuranceRiderContract?:  {
    __typename: "InsuranceRiderContract",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    line: string,
    policies?:  {
      __typename: "ModelPolicyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateInsuranceRiderContractSubscriptionVariables = {
  filter?: ModelSubscriptionInsuranceRiderContractFilterInput | null,
};

export type OnUpdateInsuranceRiderContractSubscription = {
  onUpdateInsuranceRiderContract?:  {
    __typename: "InsuranceRiderContract",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    line: string,
    policies?:  {
      __typename: "ModelPolicyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteInsuranceRiderContractSubscriptionVariables = {
  filter?: ModelSubscriptionInsuranceRiderContractFilterInput | null,
};

export type OnDeleteInsuranceRiderContractSubscription = {
  onDeleteInsuranceRiderContract?:  {
    __typename: "InsuranceRiderContract",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    line: string,
    policies?:  {
      __typename: "ModelPolicyConnection",
      nextToken?: string | null,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePolicySubscriptionVariables = {
  filter?: ModelSubscriptionPolicyFilterInput | null,
};

export type OnCreatePolicySubscription = {
  onCreatePolicy?:  {
    __typename: "Policy",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    line: string,
    insurerId: string,
    insurer?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    insuranceRiderContractPoliciesId?: string | null,
  } | null,
};

export type OnUpdatePolicySubscriptionVariables = {
  filter?: ModelSubscriptionPolicyFilterInput | null,
};

export type OnUpdatePolicySubscription = {
  onUpdatePolicy?:  {
    __typename: "Policy",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    line: string,
    insurerId: string,
    insurer?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    insuranceRiderContractPoliciesId?: string | null,
  } | null,
};

export type OnDeletePolicySubscriptionVariables = {
  filter?: ModelSubscriptionPolicyFilterInput | null,
};

export type OnDeletePolicySubscription = {
  onDeletePolicy?:  {
    __typename: "Policy",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    line: string,
    insurerId: string,
    insurer?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
    insuranceRiderContractPoliciesId?: string | null,
  } | null,
};

export type OnCreateWarrantySubscriptionVariables = {
  filter?: ModelSubscriptionWarrantyFilterInput | null,
};

export type OnCreateWarrantySubscription = {
  onCreateWarranty?:  {
    __typename: "Warranty",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    plan: string,
    regulationId: string,
    warrantyStartDate?: string | null,
    warrantyPeriod?: number | null,
    distributorId: string,
    distributor?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    billingDestinationId: string,
    billingDestination?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    targetId: string,
    target?:  {
      __typename: "Target",
      id: string,
      type: string,
      warrantyId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateWarrantySubscriptionVariables = {
  filter?: ModelSubscriptionWarrantyFilterInput | null,
};

export type OnUpdateWarrantySubscription = {
  onUpdateWarranty?:  {
    __typename: "Warranty",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    plan: string,
    regulationId: string,
    warrantyStartDate?: string | null,
    warrantyPeriod?: number | null,
    distributorId: string,
    distributor?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    billingDestinationId: string,
    billingDestination?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    targetId: string,
    target?:  {
      __typename: "Target",
      id: string,
      type: string,
      warrantyId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteWarrantySubscriptionVariables = {
  filter?: ModelSubscriptionWarrantyFilterInput | null,
};

export type OnDeleteWarrantySubscription = {
  onDeleteWarranty?:  {
    __typename: "Warranty",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    plan: string,
    regulationId: string,
    warrantyStartDate?: string | null,
    warrantyPeriod?: number | null,
    distributorId: string,
    distributor?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    billingDestinationId: string,
    billingDestination?:  {
      __typename: "Client",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      name: string,
      type: string,
      address?: string | null,
      phone?: string | null,
      email?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null,
    targetId: string,
    target?:  {
      __typename: "Target",
      id: string,
      type: string,
      warrantyId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateClientSubscriptionVariables = {
  filter?: ModelSubscriptionClientFilterInput | null,
};

export type OnCreateClientSubscription = {
  onCreateClient?:  {
    __typename: "Client",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    type: string,
    address?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateClientSubscriptionVariables = {
  filter?: ModelSubscriptionClientFilterInput | null,
};

export type OnUpdateClientSubscription = {
  onUpdateClient?:  {
    __typename: "Client",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    type: string,
    address?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteClientSubscriptionVariables = {
  filter?: ModelSubscriptionClientFilterInput | null,
};

export type OnDeleteClientSubscription = {
  onDeleteClient?:  {
    __typename: "Client",
    id: string,
    effectiveEnd?: string | null,
    effectiveStart?: string | null,
    name: string,
    type: string,
    address?: string | null,
    phone?: string | null,
    email?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreateTargetSubscriptionVariables = {
  filter?: ModelSubscriptionTargetFilterInput | null,
};

export type OnCreateTargetSubscription = {
  onCreateTarget?:  {
    __typename: "Target",
    id: string,
    type: string,
    warrantyId: string,
    warranty?:  {
      __typename: "Warranty",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      plan: string,
      regulationId: string,
      warrantyStartDate?: string | null,
      warrantyPeriod?: number | null,
      distributorId: string,
      billingDestinationId: string,
      targetId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateTargetSubscriptionVariables = {
  filter?: ModelSubscriptionTargetFilterInput | null,
};

export type OnUpdateTargetSubscription = {
  onUpdateTarget?:  {
    __typename: "Target",
    id: string,
    type: string,
    warrantyId: string,
    warranty?:  {
      __typename: "Warranty",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      plan: string,
      regulationId: string,
      warrantyStartDate?: string | null,
      warrantyPeriod?: number | null,
      distributorId: string,
      billingDestinationId: string,
      targetId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteTargetSubscriptionVariables = {
  filter?: ModelSubscriptionTargetFilterInput | null,
};

export type OnDeleteTargetSubscription = {
  onDeleteTarget?:  {
    __typename: "Target",
    id: string,
    type: string,
    warrantyId: string,
    warranty?:  {
      __typename: "Warranty",
      id: string,
      effectiveEnd?: string | null,
      effectiveStart?: string | null,
      plan: string,
      regulationId: string,
      warrantyStartDate?: string | null,
      warrantyPeriod?: number | null,
      distributorId: string,
      billingDestinationId: string,
      targetId: string,
      createdAt: string,
      updatedAt: string,
    } | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
