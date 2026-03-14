#include<iostream>
using namespace std;

int main()
{
    int a,b;
    cout<<"Enter a: "<<endl;
    cin>>a;
    cout<<"Enter b: "<<endl;
    cin>>b;

    char op;
    cout<<"Enter opearation: "<<endl;
    cin>>op;

    switch (op)
    {
    case '+':
        cout<<a+b;
        break;
    case '-':
        cout<<a-b;
        break;
    case '*':
        cout<<a*b;
        break;
    case '/':
        cout<<a/b;
        break;
    case '%':
        cout<<a%b;
        break;
    
    default:
       cout<<"Please enter valid operation."<<endl;
    }
}