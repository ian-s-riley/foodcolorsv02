/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser {
    onCreateUser {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser {
    onUpdateUser {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser {
    onDeleteUser {
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
export const onCreateServing = /* GraphQL */ `
  subscription OnCreateServing {
    onCreateServing {
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
export const onUpdateServing = /* GraphQL */ `
  subscription OnUpdateServing {
    onUpdateServing {
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
export const onDeleteServing = /* GraphQL */ `
  subscription OnDeleteServing {
    onDeleteServing {
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
export const onCreateIngredient = /* GraphQL */ `
  subscription OnCreateIngredient {
    onCreateIngredient {
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
export const onUpdateIngredient = /* GraphQL */ `
  subscription OnUpdateIngredient {
    onUpdateIngredient {
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
export const onDeleteIngredient = /* GraphQL */ `
  subscription OnDeleteIngredient {
    onDeleteIngredient {
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
export const onCreateReason = /* GraphQL */ `
  subscription OnCreateReason {
    onCreateReason {
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
export const onUpdateReason = /* GraphQL */ `
  subscription OnUpdateReason {
    onUpdateReason {
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
export const onDeleteReason = /* GraphQL */ `
  subscription OnDeleteReason {
    onDeleteReason {
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
