#include<iostream>
#include<stack>
using namespace std;

int main()
{
    stack<int> st;

    //insertion
    st.push(10);
    //10
    st.push(20);
    //10,20
    st.push(30);
    //10,20,30
    st.push(40);
    //10,20,30,40
    st.push(50);
    //10,20,30,40,50

    cout<<st.size()<<endl;
    cout<<st.top()<<endl;
    st.pop();
    //10,20,30,40
    cout<<st.top();

    //if (st.empty()==empty){...}
    //swap
    return 0;
}