import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { CartContext } from "../../context/cart.context";
import Navbar from "../navbar/Narbar";
import Product from "../../models/Product";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveIcon from '@mui/icons-material/Remove';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { apiCheckLogin } from "../../remote/e-commerce-api/authService";

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-weight: 300;
  text-align: center;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border-radius: 10px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Info = styled.div`
  flex: 3;
`;

const ProductContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ProductDetail = styled.div`
  flex: 2;
  display: flex;
`;

const Image = styled.img`
  width: 200px;
`;

const Details = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

const ProductName = styled.span``;

const ProductId = styled.span``;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`;

const ProductSize = styled.span``;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const ProductAmount = styled.div`
  font-size: 24px;
  margin: 5px;
`;

const ProductPrice = styled.div`
  font-size: 30px;
  font-weight: 200;
`;

const Hr = styled.hr`
  background-color: #eee;
  border: none;
  height: 1px;
`;

const Summary = styled.div`
  flex: 1;
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: 50vh;
`;

const SummaryTitle = styled.h1`
  font-weight: 200;
`;

const SummaryItem = styled.div`
  margin: 30px 0px;
  display: flex;
  justify-content: space-between;
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
  border-radius: 10px;
`;


export const Cart = () =>  {
  const { cart, setCart } = useContext(CartContext);
  const [loggedInStatus, setLoggedInStatus] = useState<number>(1);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      const result = await apiCheckLogin();
      setLoggedInStatus(result.payload);
      if(result.payload == 1){navigate("/")}
      if(result.status == 500){navigate("/500")};
    };
    fetchData();
  }, []);


  const removeProductFromCart = (product: Product) => {

    setCart(cart.filter((obj) => {
      return obj.id != product.id;
    }));
  }

  const handleAdd = (product: Product) => {
    if(product.cartCount < product.quantity) {
      const newCart = [...cart];
      const index = newCart.findIndex((searchProduct) => {
        return searchProduct.id === product.id;
      });

      if (index === -1) newCart.push(product);
      else newCart[index].cartCount += 1;

      setCart(newCart);
    }
  }

  const handleSubtract = (product: Product) => {
    if(product.cartCount >= 2) {
      const newCart = [...cart];
      const index = newCart.findIndex((searchProduct) => {
        return searchProduct.id === product.id;
      });

      if (index === -1) newCart.push(product);
      else newCart[index].cartCount -= 1;

      setCart(newCart);
    }
  }


  return (
    <Container>
      <Navbar />
      <Wrapper>
        <Title>YOUR BAG</Title>
        <Top>
          <TopButton onClick={() => {navigate('/')}}>CONTINUE SHOPPING</TopButton>
          <TopButton onClick={() => {navigate('/checkout')}}>CHECKOUT NOW</TopButton>
        </Top>
        <Bottom>
          <Info>
            {
              cart.map((product)=> (
                <>
                  <ProductContainer>
                    <ProductDetail>
                      <Image src={product.image} />
                      <Details>
                        <ProductName>
                          <b>Product:</b> {product.name}
                        </ProductName>
                        <ProductId>
                          <b>ID:</b> {product.id}
                        </ProductId>
                        <DeleteIcon onClick={() => {removeProductFromCart({...product})}}/>
                      </Details>
                    </ProductDetail>
                    <PriceDetail>
                      <ProductAmountContainer>
                        <RemoveCircleOutlineIcon onClick={() => {handleSubtract({...product})}}/>
                        <ProductAmount>{product.cartCount}</ProductAmount>
                        <AddCircleOutlineIcon onClick={() => {handleAdd({...product})}}/>
                      </ProductAmountContainer>
                      <ProductPrice>$ {product.price * product.cartCount}</ProductPrice>
                    </PriceDetail>
                  </ProductContainer>
                  <Hr/>
                </>
              ))
            }
          </Info>
          <Summary>
            <SummaryTitle>ORDER SUMMARY</SummaryTitle>
            <SummaryItem>
              <SummaryItemText>Subtotal</SummaryItemText>
              <SummaryItemPrice>$ 
                  {cart.reduce<number>((total, product) => total + product.price * product.cartCount, 0)}
              </SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Estimated Shipping</SummaryItemText>
              <SummaryItemPrice>$ 5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Shipping Discount</SummaryItemText>
              <SummaryItemPrice>$ -5.90</SummaryItemPrice>
            </SummaryItem>
            <SummaryItem>
              <SummaryItemText>Total</SummaryItemText>
              <SummaryItemPrice>$ 
                {cart.reduce<number>((total, product) => total + product.price * product.cartCount, 0)}
              </SummaryItemPrice>
            </SummaryItem>
            <Button onClick={() => {navigate('/checkout')}}>CHECKOUT NOW</Button>
          </Summary>
        </Bottom>
      </Wrapper>
    </Container>
  );
};