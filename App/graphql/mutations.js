/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      username
      password
      phoneNumber
      email
      name
      icon
      diet
      status
      createdAt
      updatedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      username
      password
      phoneNumber
      email
      name
      icon
      diet
      status
      createdAt
      updatedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      username
      password
      phoneNumber
      email
      name
      icon
      diet
      status
      createdAt
      updatedAt
    }
  }
`;
export const createServing = /* GraphQL */ `
  mutation CreateServing(
    $input: CreateServingInput!
    $condition: ModelServingConditionInput
  ) {
    createServing(input: $input, condition: $condition) {
      id
      userId
      color
      datetime
      add
      createdAt
      updatedAt
    }
  }
`;
export const updateServing = /* GraphQL */ `
  mutation UpdateServing(
    $input: UpdateServingInput!
    $condition: ModelServingConditionInput
  ) {
    updateServing(input: $input, condition: $condition) {
      id
      userId
      color
      datetime
      add
      createdAt
      updatedAt
    }
  }
`;
export const deleteServing = /* GraphQL */ `
  mutation DeleteServing(
    $input: DeleteServingInput!
    $condition: ModelServingConditionInput
  ) {
    deleteServing(input: $input, condition: $condition) {
      id
      userId
      color
      datetime
      add
      createdAt
      updatedAt
    }
  }
`;
export const createIngredient = /* GraphQL */ `
  mutation CreateIngredient(
    $input: CreateIngredientInput!
    $condition: ModelIngredientConditionInput
  ) {
    createIngredient(input: $input, condition: $condition) {
      id
      name
      color
      type
      imageUri
      createdAt
      updatedAt
    }
  }
`;
export const updateIngredient = /* GraphQL */ `
  mutation UpdateIngredient(
    $input: UpdateIngredientInput!
    $condition: ModelIngredientConditionInput
  ) {
    updateIngredient(input: $input, condition: $condition) {
      id
      name
      color
      type
      imageUri
      createdAt
      updatedAt
    }
  }
`;
export const deleteIngredient = /* GraphQL */ `
  mutation DeleteIngredient(
    $input: DeleteIngredientInput!
    $condition: ModelIngredientConditionInput
  ) {
    deleteIngredient(input: $input, condition: $condition) {
      id
      name
      color
      type
      imageUri
      createdAt
      updatedAt
    }
  }
`;
export const createReason = /* GraphQL */ `
  mutation CreateReason(
    $input: CreateReasonInput!
    $condition: ModelReasonConditionInput
  ) {
    createReason(input: $input, condition: $condition) {
      id
      ingredient
      color
      title
      text
      createdAt
      updatedAt
    }
  }
`;
export const updateReason = /* GraphQL */ `
  mutation UpdateReason(
    $input: UpdateReasonInput!
    $condition: ModelReasonConditionInput
  ) {
    updateReason(input: $input, condition: $condition) {
      id
      ingredient
      color
      title
      text
      createdAt
      updatedAt
    }
  }
`;
export const deleteReason = /* GraphQL */ `
  mutation DeleteReason(
    $input: DeleteReasonInput!
    $condition: ModelReasonConditionInput
  ) {
    deleteReason(input: $input, condition: $condition) {
      id
      ingredient
      color
      title
      text
      createdAt
      updatedAt
    }
  }
`;
