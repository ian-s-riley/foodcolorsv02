/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
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
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
    }
  }
`;
export const getServing = /* GraphQL */ `
  query GetServing($id: ID!) {
    getServing(id: $id) {
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
export const listServings = /* GraphQL */ `
  query ListServings(
    $filter: ModelServingFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listServings(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        userId
        color
        datetime
        add
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getIngredient = /* GraphQL */ `
  query GetIngredient($id: ID!) {
    getIngredient(id: $id) {
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
export const listIngredients = /* GraphQL */ `
  query ListIngredients(
    $filter: ModelIngredientFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listIngredients(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        color
        type
        imageUri
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getReason = /* GraphQL */ `
  query GetReason($id: ID!) {
    getReason(id: $id) {
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
export const listReasons = /* GraphQL */ `
  query ListReasons(
    $filter: ModelReasonFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listReasons(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        ingredient
        color
        title
        text
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
